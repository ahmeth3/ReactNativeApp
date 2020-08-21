import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Button, DatePickerInput, Input } from '../../components/common';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default class AddConsultationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeOFDate: 'day',
      day: '',
      repeatEveryWeek: false,
      timeStart: '',
      timeEnd: '',
      place: '',
      DoB: '',
      DoBPost: '',
      datePickerVisible: false,
      timePickerVisible: false,
    };

    this.jwt = this.props.route.params.jwt;

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: 'rgb(27,41,69)',
      },
      headerTitle: 'Dodajte konsultacije',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
      headerBackTitle: 'Nazad',
    });

    this.showTimePicker = this.showTimePicker.bind(this);
    this.hideTimePicker = this.hideTimePicker.bind(this);
    this.confirmTimePicker = this.confirmTimePicker.bind(this);

    this.showDatePicker = this.showDatePicker.bind(this);
    this.hideDatePicker = this.hideDatePicker.bind(this);
    this.confirmDatePicker = this.confirmDatePicker.bind(this);
  }

  showTimePicker() {
    this.setState({ timePickerVisible: true });
  }

  hideTimePicker() {
    this.setState({ timePickerVisible: false });
  }

  confirmTimePicker(value) {
    var hour = (value.getHours() < 10 ? '0' : '') + value.getHours();
    var minutes = (value.getMinutes() < 10 ? '0' : '') + value.getMinutes();

    var startTime = hour + ':' + minutes;

    var endTimeHour = value.getHours() + 2;
    endTimeHour = (endTimeHour < 10 ? '0' : '') + endTimeHour;
    var endTime = endTimeHour + ':' + minutes;

    this.setState({ timeStart: startTime, timeEnd: endTime });
    this.hideTimePicker();
  }

  showDatePicker() {
    this.setState({ datePickerVisible: true });
  }

  hideDatePicker() {
    this.setState({ datePickerVisible: false });
  }

  confirmDatePicker(value) {
    const months = [
      'Januar',
      'Februar',
      'Mart',
      'April',
      'Maj',
      'Jun',
      'Jul',
      'Avgust',
      'Septembar',
      'Oktobar',
      'Novembar',
      'Decembar',
    ];

    var year = value.getFullYear();
    var month = months[value.getMonth()];
    var day = value.getDate();
    var dateString = day + '. ' + month + ' ' + year + '. godine';

    var dateForPost = year + '-' + (value.getMonth() + 1) + '-' + day;
    this.setState({ DoBPost: dateForPost });

    this.setState({ DoB: dateString });
    this.hideDatePicker();
  }

  addConsultation() {
    axios
      .post(
        `https://blooming-castle-17380.herokuapp.com/consultation/create/${this.jwt}`,
        {
          typeOFDate: this.state.typeOFDate,
          day: this.state.day,
          repeatEveryWeek: this.state.repeatEveryWeek,
          date: this.state.DoBPost,
          startTime: this.state.timeStart,
          endTime: this.state.timeEnd,
          place: this.state.place,
        }
      )
      .then((response) => {
        // Handle the JWT response here
        console.log('response je ' + response);
      })
      .catch((error) => {
        // Handle returned errors here
        console.log(error.response.data);
      });
  }

  render() {
    return (
      <View style={styles.center}>
        <KeyboardAvoidingView style={styles.form} behavior={'padding'}>
          <ScrollView>
            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={{
                  ...styles.dateButton,
                  borderTopLeftRadius: 15,
                  borderRightColor: 'white',
                  borderRightWidth: 1,
                  backgroundColor:
                    this.state.typeOFDate == 'date'
                      ? 'rgb(27,41,69)'
                      : 'rgb(20, 20, 20)',
                }}
                onPress={() => {
                  this.setState({ typeOFDate: 'day' });
                }}
              >
                <Text style={styles.dateButtonTitle}>Dani</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.dateButton,
                  borderTopRightRadius: 15,
                  backgroundColor:
                    this.state.typeOFDate == 'day'
                      ? 'rgb(27,41,69)'
                      : 'rgb(20, 20, 20)',
                }}
                onPress={() => {
                  this.setState({
                    typeOFDate: 'date',
                    day: '',
                    repeatEveryWeek: false,
                  });
                }}
              >
                <Text style={styles.dateButtonTitle}>Datum</Text>
              </TouchableOpacity>
            </View>

            {this.state.typeOFDate == 'day' ? (
              <View
                style={{
                  borderColor: 'white',
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                }}
              >
                <View style={styles.workDays}>
                  <TouchableOpacity
                    style={{
                      ...styles.day,
                      borderRightColor: 'white',
                      borderRightWidth: 1,
                      backgroundColor:
                        this.state.day == 'P'
                          ? 'rgb(20, 20, 20)'
                          : 'rgb(27,41,69)',
                    }}
                    onPress={() => {
                      this.setState({ day: 'P' });
                    }}
                  >
                    <Text style={styles.dateButtonTitle}>P</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.day,
                      borderRightColor: 'white',
                      borderRightWidth: 1,
                      backgroundColor:
                        this.state.day == 'U'
                          ? 'rgb(20, 20, 20)'
                          : 'rgb(27,41,69)',
                    }}
                    onPress={() => {
                      this.setState({ day: 'U' });
                    }}
                  >
                    <Text style={styles.dateButtonTitle}>U</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.day,
                      borderRightColor: 'white',
                      borderRightWidth: 1,
                      backgroundColor:
                        this.state.day == 'S'
                          ? 'rgb(20, 20, 20)'
                          : 'rgb(27,41,69)',
                    }}
                    onPress={() => {
                      this.setState({ day: 'S' });
                    }}
                  >
                    <Text style={styles.dateButtonTitle}>S</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.day,
                      borderRightColor: 'white',
                      borderRightWidth: 1,
                      backgroundColor:
                        this.state.day == 'Č'
                          ? 'rgb(20, 20, 20)'
                          : 'rgb(27,41,69)',
                    }}
                    onPress={() => {
                      this.setState({ day: 'Č' });
                    }}
                  >
                    <Text style={styles.dateButtonTitle}>Č</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.day,
                      backgroundColor:
                        this.state.day == 'PT'
                          ? 'rgb(10, 10, 10)'
                          : 'rgb(27,41,69)',
                    }}
                    onPress={() => {
                      this.setState({ day: 'PT' });
                    }}
                  >
                    <Text style={styles.dateButtonTitle}>P</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.repeatEveryWeek}>
                  <Text style={styles.repeatEveryWeekTitle}>
                    Ponavljati svake nedelje?
                  </Text>
                  <MaterialIcons
                    size={50}
                    {...(this.state.repeatEveryWeek
                      ? {
                          color: 'white',
                          name: 'check-box',
                        }
                      : {
                          color: 'white',
                          name: 'check-box-outline-blank',
                        })}
                    onPress={() => {
                      this.setState({
                        repeatEveryWeek: !this.state.repeatEveryWeek,
                      });
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 10,
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                }}
              >
                <Text style={styles.repeatEveryWeekTitle}>Datum: </Text>
                <View style={styles.datePickerContainer}>
                  <DatePickerInput
                    value={this.state.DoB}
                    onPress={() => this.showDatePicker()}
                  ></DatePickerInput>
                </View>
                <DateTimePickerModal
                  isVisible={this.state.datePickerVisible}
                  mode="date"
                  isDarkModeEnabled={false}
                  onCancel={this.hideDatePicker}
                  onConfirm={(date) => {
                    this.confirmDatePicker(date);
                  }}
                />
              </View>
            )}

            <View style={styles.additionalInfo}>
              <Text style={styles.repeatEveryWeekTitle}>Izaberite vreme:</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.repeatEveryWeekTitle}>od</Text>
                <View style={styles.pickerContainer}>
                  <DatePickerInput
                    value={this.state.timeStart}
                    onPress={() => this.showTimePicker()}
                  ></DatePickerInput>
                </View>
                <Text style={styles.repeatEveryWeekTitle}>do</Text>
                <View style={styles.pickerContainer}>
                  <DatePickerInput value={this.state.timeEnd}></DatePickerInput>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
              >
                <Text style={styles.repeatEveryWeekTitle}>Mesto:</Text>
                <View style={styles.placeContainer}>
                  <Input
                    value={this.state.place}
                    placeholder="npr. 207 Nova Zgrada"
                    onChangeText={(place) => this.setState({ place })}
                  />
                </View>
              </View>
            </View>
            <DateTimePickerModal
              isVisible={this.state.timePickerVisible}
              mode="time"
              isDarkModeEnabled={false}
              onCancel={this.hideTimePicker}
              onConfirm={(time) => {
                this.confirmTimePicker(time);
              }}
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                // this.addConsultation();
                if (this.state.typeOFDate == 'day') {
                  var chosenDay = 1;
                  if (this.state.day == 'P') {
                    chosenDay = 1;
                  }
                  if (this.state.day == 'U') {
                    chosenDay = 2;
                  }
                  if (this.state.day == 'S') {
                    chosenDay = 3;
                  }
                  if (this.state.day == 'Č') {
                    chosenDay = 4;
                  }
                  if (this.state.day == 'PT') {
                    chosenDay = 5;
                  }

                  var todaysDate = new Date();
                  var scheduledDate = new Date();

                  if (todaysDate.getDay() < chosenDay) {
                    scheduledDate = scheduledDate.setDate(
                      todaysDate.getDate() + chosenDay - todaysDate.getDay() + 1
                    );
                  } else if (todaysDate.getDay() > chosenDay) {
                    scheduledDate = scheduledDate.setDate(
                      todaysDate.getDate() +
                        chosenDay +
                        (8 - todaysDate.getDay())
                    );
                  } else if (todaysDate.getDay() == chosenDay) {
                    scheduledDate = scheduledDate.setDate(todaysDate.getDate());
                    var formattedDate = new Date(scheduledDate);

                    var chosenStartTime = this.state.timeStart;
                    chosenStartTime = chosenStartTime.split(':');
                    var chosenHour = parseInt(chosenStartTime[0]);
                    var chosenMinutes = parseInt(chosenStartTime[1]);

                    if (
                      chosenHour * 60 + chosenMinutes <
                      parseInt(formattedDate.getHours()) * 60 +
                        parseInt(formattedDate.getMinutes())
                    ) {
                      scheduledDate = todaysDate.setDate(
                        todaysDate.getDate() + 7
                      );
                    }
                  }

                  var formattedDate = new Date(scheduledDate);

                  formattedDate.setUTCHours(0, 0, 0, 0);
                  this.setState({ DoBPost: formattedDate }, () => {
                    this.addConsultation();
                  });
                } else {
                  this.addConsultation();
                }
              }}
            >
              <Text style={styles.confirmButtonText}>Dodajte</Text>
            </TouchableOpacity>
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
  dateContainer: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  dateButton: {
    width: '50%',
    height: 60,
    backgroundColor: 'rgb(27,41,69)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  workDays: {
    height: 80,
    width: '100%',
    backgroundColor: 'rgb(27,41,69)',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  day: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatEveryWeek: {
    flexDirection: 'row',
    paddingVertical: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  repeatEveryWeekTitle: {
    color: '#fff',
    fontSize: 20,
    alignSelf: 'center',
  },
  additionalInfo: { marginTop: 20 },
  pickerContainer: {
    width: '30%',
    margin: 10,
  },
  placeContainer: { width: '70%', marginHorizontal: 5 },
  datePickerContainer: { width: '70%', marginLeft: 10 },
  confirmButton: {
    width: '60%',
    height: '15%',
    alignSelf: 'center',
    marginTop: '10%',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'rgb(27,41,69)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
