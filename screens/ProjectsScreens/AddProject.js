import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  Card,
  Input,
  Button,
  DatePickerInput,
  Loading,
} from '../../components/common';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FlatList } from 'react-native-gesture-handler';

export default class AddProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      mandatory: false,
      numberOfAttendees: '',
      points: '',
    };

    this.subject = this.props.route.params.subject;
    this.jwt = this.props.route.params.jwt;

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: 'rgb(27,41,69)',
      },
      headerTitle: 'Dodajte',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
    });

    this.addProject = this.addProject.bind(this);
  }

  addProject() {
    console.log(this.jwt);
    axios
      .post(
        `https://blooming-castle-17380.herokuapp.com/project/create/${this.props.route.params.jwt}`,
        {
          name: this.state.name,
          description: this.state.description,
          mandatory: this.state.mandatory,
          numberOfAttendees: this.state.numberOfAttendees,
          points: this.state.points,
          subject: this.subject._id,
        }
      )
      .then((response) => {
        // Handle the JWT response here
        this.props.navigation.goBack();
      })
      .catch((error) => {
        // Handle returned errors here
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.center}>
        <KeyboardAvoidingView behavior={'padding'} enabled style={styles.form}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Text style={styles.headerTitle}>Naziv projekta</Text>
            <View style={styles.nameInputContainer}>
              <TextInput
                placeholder="Naziv projekta"
                placeholderTextColor={'rgb(27,41,69)'}
                style={styles.nameinputStyle}
                value={this.state.name}
                onChangeText={(value) => this.setState({ name: value })}
              />
            </View>
            <Text style={{ ...styles.headerTitle, marginTop: 10 }}>
              Opis projekta
            </Text>
            <View
              style={{
                ...styles.nameInputContainer,
                height: 100,
              }}
            >
              <TextInput
                placeholder="Opis projekta"
                placeholderTextColor={'rgb(27,41,69)'}
                style={styles.nameinputStyle}
                multiline={true}
                value={this.state.description}
                onChangeText={(value) => this.setState({ description: value })}
              />
            </View>
            <View style={styles.repeatEveryWeek}>
              <Text style={styles.repeatEveryWeekTitle}>Obavezan?</Text>
              <MaterialIcons
                size={50}
                {...(this.state.mandatory
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
                    mandatory: !this.state.mandatory,
                  });
                }}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.repeatEveryWeekTitle}>Broj učesnika:</Text>
              <View
                style={{
                  ...styles.nameInputContainer,
                  width: '60%',
                  height: 60,
                }}
              >
                <TextInput
                  placeholder="broj učesnika"
                  placeholderTextColor={'rgb(27,41,69)'}
                  keyboardType={'number-pad'}
                  style={styles.nameinputStyle}
                  value={this.state.numberOfAttendees}
                  onChangeText={(value) => {
                    this.setState({ numberOfAttendees: value });
                  }}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text style={styles.repeatEveryWeekTitle}>Broj poena:</Text>
              <View
                style={{
                  ...styles.nameInputContainer,
                  width: '60%',
                  height: 60,
                  marginLeft: 22,
                }}
              >
                <TextInput
                  placeholder="broj poena"
                  keyboardType={'number-pad'}
                  placeholderTextColor={'rgb(27,41,69)'}
                  style={styles.nameinputStyle}
                  value={this.state.points}
                  onChangeText={(value) => {
                    this.setState({ points: value });
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                this.addProject();
                // if (
                //   this.state.name == '' ||
                //   this.state.description == '' ||
                //   this.state.numberOfAttendees == '' ||
                //   this.state.points == ''
                // ) {
                //   Alert.alert(
                //     'Greška!',
                //     'Popunite sva polja!',
                //     [{ text: 'OK' }],
                //     {
                //       cancelable: false,
                //     }
                //   );
                // } else if (
                //   this.state.numberOfAttendees.includes('.') ||
                //   this.state.numberOfAttendees.includes('-') ||
                //   this.state.numberOfAttendees.includes(',') ||
                //   this.state.numberOfAttendees.includes(' ')
                // ) {
                //   Alert.alert(
                //     'Greška!',
                //     'Broj učesnika mora biti ceo broj!',
                //     [{ text: 'OK' }],
                //     {
                //       cancelable: false,
                //     }
                //   );
                // } else if (
                //   this.state.points.includes('.') ||
                //   this.state.points.includes('-') ||
                //   this.state.points.includes(',') ||
                //   this.state.points.includes(' ')
                // ) {
                //   Alert.alert(
                //     'Greška!',
                //     'Broj poena mora biti ceo broj!',
                //     [{ text: 'OK' }],
                //     {
                //       cancelable: false,
                //     }
                //   );
                // } else
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
  },
  form: {
    backgroundColor: 'rgb(27,41,69)',
    width: '95%',
    height: '90%',
    borderRadius: 25,
    borderColor: 'orange',
    padding: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    alignSelf: 'center',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  nameInputContainer: {
    width: '100%',
    height: 55,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.85)',
    borderColor: 'rgba(27,41,69, 0.9)',
    borderWidth: 1,
    borderRadius: 20,
  },
  nameinputStyle: {
    width: '100%',
    paddingLeft: 20,
    fontSize: 18,
    lineHeight: 23,
    flex: 3,
    color: 'rgb(27,41,69)',
  },
  repeatEveryWeek: {
    flexDirection: 'row',
    paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatEveryWeekTitle: {
    color: '#fff',
    fontSize: 20,
    alignSelf: 'center',
    marginRight: 20,
  },
  confirmButton: {
    width: '60%',
    height: '10%',
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
