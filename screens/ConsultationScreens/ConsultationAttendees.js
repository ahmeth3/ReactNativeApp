import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  KeyboardAvoidingView,
  Alert,
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
import { FlatList, ScrollView } from 'react-native-gesture-handler';

export default class ConsultationAttendees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: '',
      account_type: '',
      loading: false,
    };

    this.jwt = this.props.route.params.jwt;
    this.account_type = this.props.route.params.account_type;
    this.item = this.props.route.params.item;

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: 'rgb(27,41,69)',
      },
      headerTitle: 'Prijavite se',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
    });
  }

  attend(counter) {
    if (this.item.myConsCounter != -1) {
      Alert.alert(
        'Greška',
        'Već ste prijavljeni na ovim konsultacijama!',
        [{ text: 'Okej' }],
        { cancelable: false }
      );
    } else {
      axios
        .patch(
          `https://blooming-castle-17380.herokuapp.com/consultation/attend/${this.jwt}`,
          {
            _id: this.item._id,
            counter: counter,
          }
        )
        .then((response) => {
          // Handle the JWT response here
          console.log('response je ' + response);
          this.props.navigation.goBack();
        })
        .catch((error) => {
          // Handle returned errors here
          console.log(error.response);
        });
    }
  }

  giveUp(counter) {
    axios
      .patch(
        `https://blooming-castle-17380.herokuapp.com/consultation/giveUp/${this.jwt}`,
        {
          _id: this.item._id,
          counter: counter,
        }
      )
      .then((response) => {
        // Handle the JWT response here
        console.log('response je ' + response);
        this.props.navigation.goBack();
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

  countTermin(value, counter) {
    var startTime = value.split(':');
    var startTimeHour = startTime[0];
    var startTimeMinute = startTime[1];

    var startTimeMinutes =
      parseInt(startTimeHour) * 60 +
      parseInt(startTimeMinute) +
      (counter - 1) * 30;

    var endTimeMinutes = startTimeMinutes + 30;

    var startHour = Math.floor(startTimeMinutes / 60);
    var startMinutes = startTimeMinutes % 60;

    startHour = (startHour < 10 ? '0' : '') + startHour.toString();
    startMinutes = (startMinutes < 10 ? '0' : '') + startMinutes.toString();

    var endHour = Math.floor(endTimeMinutes / 60);
    var endMinutes = endTimeMinutes % 60;

    endHour = (endHour < 10 ? '0' : '') + endHour.toString();
    endMinutes = (endMinutes < 10 ? '0' : '') + endMinutes.toString();

    return (
      startHour.toString() +
      ':' +
      startMinutes.toString() +
      '-' +
      endHour.toString() +
      ':' +
      endMinutes.toString()
    );
  }

  whichButton(counter) {
    if (this.account_type == 'Student') {
      if (this.item.myConsCounter == counter) {
        return (
          <TouchableOpacity
            style={{ ...styles.confirmButton, borderColor: 'green' }}
            onPress={() => {
              this.giveUp(counter);
            }}
          >
            <Text style={styles.confirmButtonText}>Odustani</Text>
          </TouchableOpacity>
        );
      } else if (
        this.item.attendees[counter] != null &&
        this.item.myConsCounter != counter
      ) {
        return (
          <TouchableOpacity
            style={{ ...styles.confirmButton, borderColor: 'red' }}
          >
            <Text style={styles.confirmButtonText}>Zauzeto</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              this.attend(counter);
            }}
          >
            <Text style={styles.confirmButtonText}>Prijavite se</Text>
          </TouchableOpacity>
        );
      }
    } else {
      if (this.item.attendees[counter] != null) {
        return (
          <TouchableOpacity
            style={{ ...styles.confirmButton, borderColor: 'red' }}
          >
            <Text style={styles.confirmButtonText}>
              Zauzeto{this.item.myConsCounter}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Slobodno</Text>
          </TouchableOpacity>
        );
      }
    }
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
          <KeyboardAvoidingView style={styles.form} behavior={'padding'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.header}>
                {this.account_type == 'Student' ? (
                  <View>
                    <Text style={styles.professorName}>
                      {this.item.professorName}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.topView}>
                  {this.item.typeOFDate == 'day' ? (
                    <Text style={styles.dayTitle}>
                      {this.whichDay(this.item.day)}
                    </Text>
                  ) : (
                    <Text style={styles.dayTitle}>
                      {this.convertDate(this.item.date)}
                    </Text>
                  )}

                  <Text style={styles.time}>
                    {this.item.startTime}-{this.item.endTime}
                  </Text>
                </View>
                <View style={styles.midView}>
                  {this.item.typeOFDate == 'day' ? (
                    <Text style={styles.midViewText}>
                      {this.item.repeatEveryWeek ? 'Svake nedelje' : ''}
                    </Text>
                  ) : (
                    <Text style={styles.midViewText}></Text>
                  )}

                  <Text style={styles.midViewText}>{this.item.place}</Text>
                </View>
              </View>
              <View style={styles.attendeesContainer}>
                <View style={styles.attendeRow}>
                  <View style={styles.leftPart}>
                    <Text style={styles.leftPartText}>I termin</Text>
                    <Text style={styles.leftPartText}>
                      {this.countTermin(this.item.startTime, 1)}
                    </Text>
                  </View>
                  <View style={styles.rightPart}>{this.whichButton(0)}</View>
                </View>
                <View style={styles.attendeRow}>
                  <View style={styles.leftPart}>
                    <Text style={styles.leftPartText}>II termin</Text>
                    <Text style={styles.leftPartText}>
                      {this.countTermin(this.item.startTime, 2)}
                    </Text>
                  </View>
                  <View style={styles.rightPart}>{this.whichButton(1)}</View>
                </View>
                <View style={styles.attendeRow}>
                  <View style={styles.leftPart}>
                    <Text style={styles.leftPartText}>III termin</Text>
                    <Text style={styles.leftPartText}>
                      {this.countTermin(this.item.startTime, 3)}
                    </Text>
                  </View>
                  <View style={styles.rightPart}>{this.whichButton(2)}</View>
                </View>
                <View style={styles.attendeRow}>
                  <View style={styles.leftPart}>
                    <Text style={styles.leftPartText}>IV termin</Text>
                    <Text style={styles.leftPartText}>
                      {this.countTermin(this.item.startTime, 4)}
                    </Text>
                  </View>
                  <View style={styles.rightPart}>{this.whichButton(3)}</View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
    paddingVertical: '15%',
  },
  form: {
    flex: 1,
    width: '85%',
    backgroundColor: 'rgb(27,41,69)',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
  },
  header: {
    width: '100%',
    height: '20%',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  professorName: {
    color: '#fff',
    fontSize: 24,
  },
  topView: {
    height: '40%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: {
    color: '#fff',
    fontSize: 18,
  },
  time: { color: '#fff', fontSize: 18 },
  midView: {
    height: '20%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  midViewText: { color: '#fff', fontSize: 18 },
  attendeesContainer: {
    height: '80%',
    width: '100%',
    flexDirection: 'column',
  },
  attendeRow: {
    height: '25%',
    width: '100%',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    flexDirection: 'row',
  },
  leftPart: {
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftPartText: { color: '#fff', fontSize: 18, marginBottom: 10 },
  rightPart: {
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: '90%',
    height: '50%',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'rgb(27,41,69)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: { color: 'white', fontSize: 18, fontWeight: '700' },
});
