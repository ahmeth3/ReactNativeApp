import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  SafeAreaView,
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

export default class SpecificProjects extends Component {
  constructor(props) {
    super(props);
    this.state = { fetchedProjects: [] };

    this.subject = this.props.route.params.subject;
    this.jwt = this.props.route.params.jwt;
    this.account_type = this.props.route.params.account_type;

    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
      this.getProjects();
    }, 1000);

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: 'rgb(27,41,69)',
      },
      headerTitle: 'Projekti',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
      headerRight:
        this.account_type == 'Profesor'
          ? () => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('AddProject', {
                    jwt: this.jwt,
                    subject: this.subject,
                  });
                }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  width: 70,
                }}
              >
                <Text style={{ fontSize: 14, color: 'white' }}>Dodajte</Text>
              </TouchableOpacity>
            )
          : null,
    });

    this.getProjects();
  }

  getProjects() {
    axios
      .post(
        `https://blooming-castle-17380.herokuapp.com/project/list/${this.jwt}`,
        {
          subjectId: this.subject._id,
        }
      )
      .then((response) => {
        // Handle the JWT response here
        this.setState({
          fetchedProjects: response.data,
        });
      })
      .catch((error) => {
        // Handle returned errors here
        console.log(error.response);
      });
  }

  attend(id) {
    axios
      .patch(
        `https://blooming-castle-17380.herokuapp.com/student/attend/${this.jwt}`,
        {
          _id: id,
        }
      )
      .then((response) => {
        // Handle the JWT response here
        console.log('response je ' + response);
        // this.props.navigation.goBack();
      })
      .catch((error) => {
        // Handle returned errors here
        console.log(error.response);
      });
  }

  giveUp(id) {
    axios
      .patch(
        `https://blooming-castle-17380.herokuapp.com/student/giveUp/${this.jwt}`,
        {
          _id: id,
        }
      )
      .then((response) => {
        // Handle the JWT response here
        console.log('response je ' + response);
        // this.props.navigation.goBack();
      })
      .catch((error) => {
        // Handle returned errors here
        console.log(error.response);
      });
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

  convertToString(value) {
    var str = '';

    for (var i = 0; i < value.length; i++) {
      if (i == 0) {
        str += value[i].toString();
      } else {
        str += ', ' + value[i].toString();
      }
    }

    return str;
  }

  convertMandatory(value) {
    if (value == true) return 'je obavezan.';
    else return 'nije obavezan.';
  }

  numberOfAttendees(attendees) {
    return attendees.length.toString();
  }

  whichButton(item) {
    if (this.account_type == 'Student') {
      if (item.myProj == true) {
        return (
          <TouchableOpacity
            style={{ ...styles.confirmButton, borderColor: 'red' }}
            onPress={() => {
              this.giveUp(item._id);
            }}
          >
            <Text style={styles.confirmButtonText}>Odustani </Text>
          </TouchableOpacity>
        );
      } else if (item.attendees.length == item.numberOfAttendees) {
        return (
          <TouchableOpacity
            style={{ ...styles.confirmButton, borderColor: 'red' }}
            disabled={true}
          >
            <Text style={styles.confirmButtonText}>Zauzeto </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              this.attend(item._id);
            }}
          >
            <Text style={styles.confirmButtonText}>Prihvati </Text>
          </TouchableOpacity>
        );
      }
    } else if (this.account_type == 'Profesor') {
      return (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            this.props.navigation.navigate('EditProject', {
              jwt: this.jwt,
              account_type: this.state.account_type,
              subject: this.subject,
              project: item,
            });
          }}
        >
          <Text style={styles.confirmButtonText}>Izmenite</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={styles.center}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{this.subject.name}</Text>
          <View style={styles.department}>
            <Text style={styles.departmentHeader}>
              Departmani:{' '}
              <Text style={styles.departmentsSpecific}>
                {this.convertToString(this.subject.department)}
              </Text>
            </Text>
          </View>
          <View style={styles.profile}>
            <Text style={styles.profileHeader}>
              Smerovi:{' '}
              <Text style={styles.profilesSpecific}>
                {this.convertToString(this.subject.profile)}
              </Text>
            </Text>
          </View>
          <View style={styles.grade}>
            <Text style={styles.gradeHeader}>
              Godine studija:{' '}
              <Text style={styles.gradesSpecific}>
                {this.convertToString(this.subject.grade)}
              </Text>
            </Text>
          </View>
          <View style={styles.professors}>
            <Text style={styles.professorsHeader}>
              Predavači:{' '}
              <Text style={styles.professorsSpecific}>
                {this.convertToString(this.subject.professorsNames)}
              </Text>
            </Text>
          </View>
        </View>
        <FlatList
          data={this.state.fetchedProjects}
          keyExtractor={(item) => item._id.toString()}
          style={{ width: '90%', marginTop: 10 }}
          renderItem={({ item }) => (
            <ScrollView
              style={{
                backgroundColor: 'rgb(27,41,69)',
                borderRadius: 25,
                width: '95%',
                height: 200,
                alignSelf: 'center',
                marginBottom: 10,
                paddingHorizontal: 10,
              }}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Text style={{ ...styles.dayTitle, marginBottom: 10 }}>
                {item.name}
              </Text>

              <Text style={styles.midText}>
                Projekat {this.convertMandatory(item.mandatory)}
              </Text>
              <Text style={styles.midText}>
                Opis projekta: {item.description}
              </Text>
              <Text style={styles.midText}>
                Broj učesnika: {this.numberOfAttendees(item.attendees)}/
                {item.numberOfAttendees}
              </Text>
              <Text style={styles.midText}>Broj poena: {item.points}</Text>
              {this.whichButton(item)}
            </ScrollView>
          )}
        />
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
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  header: {
    width: '90%',
    height: '30%',
    backgroundColor: 'rgb(27,41,69)',
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    alignSelf: 'center',
  },
  department: { width: '100%', marginVertical: '3%' },
  departmentHeader: { color: '#fff', fontSize: 18 },
  departmentsSpecific: { color: '#fff', fontSize: 16 },
  profile: { width: '100%' },
  profileHeader: { color: '#fff', fontSize: 18 },
  profilesSpecific: { color: '#fff', fontSize: 16 },
  grade: { width: '100%', marginVertical: '3%' },
  gradeHeader: { color: '#fff', fontSize: 18 },
  gradesSpecific: { color: '#fff', fontSize: 16 },
  professors: { width: '100%' },
  professorsHeader: { color: '#fff', fontSize: 18 },
  professorsSpecific: { color: '#fff', fontSize: 16 },
  cardStyle: {
    padding: 10,
    borderColor: 'orange',
    borderRadius: 15,
    flexDirection: 'column',
  },
  topView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayTitle: {
    color: '#fff',
    fontSize: 18,
    alignSelf: 'center',
  },
  midText: { color: '#fff', fontSize: 16 },
  confirmButton: {
    width: '60%',
    height: '30%',
    alignSelf: 'center',
    marginTop: 10,
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
