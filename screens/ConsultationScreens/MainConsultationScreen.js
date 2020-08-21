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
    };

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
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('EditConsultation', {
              jwt: this.state.jwt,
            });
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            width: 70,
          }}
        >
          <Text style={{ fontSize: 14, color: 'white' }}>Izmenite</Text>
        </TouchableOpacity>
      ),
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
                  this.fetchMyConsultations();
                } else if (this.state.account_type == 'Student') {
                  this.setState({ loading: false });
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

  fetchMyConsultations() {
    axios
      .get(
        `https://blooming-castle-17380.herokuapp.com/consultation/professor/${this.state.jwt}`
      )
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
        console.log(error.response);
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
    if (value == 'PK') {
      convertedDay = 'Petak';
    }

    return convertedDay;
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
                <TouchableOpacity onPress={() => {}}>
                  <Card style={styles.cardStyle}>
                    <View style={styles.topView}>
                      <Text style={styles.dayTitle}>
                        {this.whichDay(item.day)}
                      </Text>
                      <Text style={styles.time}>
                        {item.startTime}-{item.endTime}
                      </Text>
                    </View>
                    <View style={styles.midView}>
                      <Text style={styles.midViewText}>
                        {item.repeatEveryWeek
                          ? 'Svake nedelje'
                          : 'Ne ponavlja se'}
                      </Text>
                      <Text style={styles.midViewText}>{item.place}</Text>
                    </View>
                    <View>
                      <Text style={styles.midViewText}>
                        Zauzetih termina: 2/4
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
    height: 90,
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
