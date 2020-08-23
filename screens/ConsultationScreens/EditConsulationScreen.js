import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Card, Button, Loading } from '../../components/common';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { HeaderBackButton } from '@react-navigation/stack';

export default class EditConsultationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedConsultations: [],
      loading: true,
      count: 0,
    };
    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
      this.fetchMyConsultations();
    }, 1000);

    this.jwt = this.props.route.params.jwt;

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: 'rgb(27,41,69)',
      },
      headerTitle: 'Izmenite konsultacije',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
    });

    this.fetchMyConsultations();
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
    axios
      .get(
        `https://blooming-castle-17380.herokuapp.com/consultation/professor/${this.jwt}`
      )
      .then((response) => {
        // Handle the JWT response here
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
        <View style={{ ...styles.center, justifyContent: 'center' }}>
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
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                height: '80%',
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('EditSpecificConsultation', {
                      jwt: this.jwt,
                      item: item,
                    });
                  }}
                >
                  <Card style={styles.cardStyle}>
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
                          {item.repeatEveryWeek
                            ? 'Svake nedelje'
                            : 'Ne ponavlja se'}
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
          <View style={{ height: '20%' }}>
            <Button
              style={styles.addButton}
              onPress={() => {
                this.props.navigation.navigate('AddConsultation', {
                  jwt: this.jwt,
                });
              }}
            >
              Dodajte konsultacije
            </Button>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  addButton: {
    height: 50,
    width: 370,
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
