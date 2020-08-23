import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {
  Card,
  Button,
  DatePickerInput,
  Loading,
} from '../../components/common';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FlatList } from 'react-native-gesture-handler';

export default class MainConsultationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: '',
      account_type: '',
      fetchedConsultations: [],
      loading: true,
      count: 0,
    };
    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
      this.loadJWT();
    }, 1000);

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: 'rgb(27,41,69)',
      },
      headerTitle: 'Konsultacije',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
      headerLeft: () => (
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
          }}
          onPress={() => {
            this.props.navigation.toggleDrawer();
          }}
        >
          <AntDesign name="bars" style={{ color: 'white', fontSize: 28 }} />
        </TouchableOpacity>
      ),
    });

    this.loadJWT();
  }

  async loadJWT() {
    try {
      const value = await AsyncStorage.getItem('id_token');
      if (value !== null) {
        //ovde da zovnem backend i validira token
        axios
          .post(
            `https://blooming-castle-17380.herokuapp.com/user/login/${value}`
          )
          .then((response) => {
            this.setState(
              {
                jwt: value,
                account_type: response.data,
              },
              () => {
                if (this.state.account_type == 'Profesor') {
                  this.props.navigation.setOptions({
                    headerRight: () => (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('EditConsultation', {
                            jwt: this.state.jwt,
                            onGoBack: () => console.log('VRATIO SAM SE'),
                          });
                        }}
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          width: 70,
                        }}
                      >
                        <Text style={{ fontSize: 14, color: 'white' }}>
                          Izmenite
                        </Text>
                      </TouchableOpacity>
                    ),
                  });
                  this.fetchMyConsultations();
                } else if (this.state.account_type == 'Student') {
                  this.fetchMyConsultations();
                }
              }
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({ count: 0 });
    });
  }

  componentWillUnmount() {
    // this.focusListener.remove();
    clearTimeout(this.t);
  }

  fetchMyConsultations() {
    var url = '';
    if (this.state.account_type == 'Profesor') {
      url = `https://blooming-castle-17380.herokuapp.com/consultation/professor/${this.state.jwt}`;
    } else if (this.state.account_type == 'Student') {
      url = `https://blooming-castle-17380.herokuapp.com/consultation/student/${this.state.jwt}`;
    }
    axios
      .get(url)
      .then((response) => {
        // Handle the JWT response here
        // console.log(response.data.data);
        this.setState({
          fetchedConsultations: response.data.data,
          loading: false,
        });
      })
      .catch((error) => {
        // Handle returned errors here
        console.log(error.response.data);
      });
  }

  whichDay(value) {
    var convertedDay = '';
    if (value == 'P') {
      convertedDay = 'Ponedeljak';
    }
    if (value == 'U') {
      convertedDay = 'Utorak';
    }
    if (value == 'S') {
      convertedDay = 'Sreda';
    }
    if (value == 'Č') {
      convertedDay = 'Četvrtak';
    }
    if (value == 'PT') {
      convertedDay = 'Petak';
    }

    return convertedDay;
  }

  convertDate(value) {
    var date = new Date(value);

    return (
      date.getDate() +
      '. ' +
      (date.getMonth() + 1) +
      '. ' +
      date.getFullYear() +
      '.'
    );
  }

  numberOfAttendees(attendees) {
    var counter = 0;

    for (var i = 0; i < attendees.length; i++) {
      if (attendees[i] != null) {
        counter++;
      }
    }
    return ' ' + counter.toString();
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.center}>
          <Loading size={'large'} />
        </View>
      );
    } else
      return (
        <View style={styles.center}>
          {this.state.fetchedConsultations.length == 0 ? (
            <Text style={styles.title}>
              Trenutno nemate zakazanih konsultacija
            </Text>
          ) : (
            <FlatList
              data={this.state.fetchedConsultations}
              keyExtractor={(item) => item._id.toString()}
              showsHorizontalScrollIndicator={false}
              style={{ width: '100%' }}
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ConsultationAttendees', {
                      jwt: this.state.jwt,
                      account_type: this.state.account_type,
                      item: item,
                    });
                  }}
                >
                  <Card
                    style={{
                      ...styles.cardStyle,
                      borderColor: item.valid ? 'orange' : 'red',
                    }}
                  >
                    {this.state.account_type == 'Student' ? (
                      <View>
                        <Text style={styles.dayTitle}>
                          {item.professorName}
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.topView}>
                      {item.typeOFDate == 'day' ? (
                        <Text style={styles.dayTitle}>
                          {this.whichDay(item.day)}
                        </Text>
                      ) : (
                        <Text style={styles.dayTitle}>
                          {this.convertDate(item.date)}
                        </Text>
                      )}

                      <Text style={styles.time}>
                        {item.startTime}-{item.endTime}
                      </Text>
                    </View>
                    <View style={styles.midView}>
                      {item.typeOFDate == 'day' ? (
                        <Text style={styles.midViewText}>
                          {item.repeatEveryWeek ? 'Svake nedelje' : ''}
                        </Text>
                      ) : (
                        <Text style={styles.midViewText}></Text>
                      )}

                      <Text style={styles.midViewText}>{item.place}</Text>
                    </View>
                    <View>
                      <Text style={styles.midViewText}>
                        Zauzetih termina:
                        {this.numberOfAttendees(item.attendees)}/4
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  title: {
    fontSize: 36,
    marginBottom: 16,
  },
  cardStyle: {
    height: 100,
    padding: 10,
    borderColor: 'orange',
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayTitle: {
    color: '#fff',
    fontSize: 18,
  },
  time: { color: '#fff', fontSize: 16 },
  midView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  midViewText: { color: '#fff', fontSize: 14 },
});
