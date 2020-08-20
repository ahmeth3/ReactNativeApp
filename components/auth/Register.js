import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Input,
  TextLink,
  Button,
  Loading,
  Heading,
  DatePickerInput,
  DropDown,
} from '../common';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerType: '',
      username: '',
      password: '',
      email: '',
      name_surname: '',
      name: '',
      surname: '',
      DoB: 'Datum rođenja',
      DoBPost: '',
      studentIdNo: '',
      department: '',
      profile: '',
      grade: '',
      datePickerVisible: false,
      profileItems: [],
      loading: false,
    };

    this.showDatePicker = this.showDatePicker.bind(this);
    this.hideDatePicker = this.hideDatePicker.bind(this);
    this.confirmDatePicker = this.confirmDatePicker.bind(this);
    this.updateProfileData = this.updateProfileData.bind(this);

    this.registerProfessor = this.registerProfessor.bind(this);
    this.registerStudent = this.registerStudent.bind(this);
    this.onRegistrationFail = this.onRegistrationFail.bind(this);
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

  updateProfileData() {
    const { department } = this.state;
    switch (department) {
      case 'Departman za pravne nauke':
        this.setState({
          profileItems: [
            {
              label: 'Pravo',
              value: 'Pravo',
            },
          ],
        });
        break;
      case 'Departman za ekonomske nauke':
        this.setState({
          profileItems: [
            {
              label: 'Ekonomija',
              value: 'Ekonomija',
            },
            {
              label: 'Poslovna informatika',
              value: 'Poslovna informatika',
            },
          ],
        });
        break;
      case 'Departman za filozofske nauke':
        this.setState({
          profileItems: [
            {
              label: 'Psihologija',
              value: 'Psihologija',
            },
            {
              label: 'Vaspitač u predškolskim ustanovama',
              value: 'Vaspitač u predškolskim ustanovama',
            },
          ],
        });
        break;
      case 'Departman za filološke nauke':
        this.setState({
          profileItems: [
            {
              label: 'Srpski jezik i književnost',
              value: 'Srpski jezik i književnost',
            },
            {
              label: 'Engleski jezik i književnost',
              value: 'Engleski jezik i književnost',
            },
          ],
        });
        break;
      case 'Departman za matematičke nauke':
        this.setState({
          profileItems: [
            {
              label: 'Matematika',
              value: 'Matematika',
            },
            {
              label: 'Matematika i fizika',
              value: 'Matematika i fizika',
            },
            {
              label: 'Informatika i matematika',
              value: 'Informatika i matematika',
            },
            {
              label: 'Informatika i fizika',
              value: 'Informatika i fizika',
            },
          ],
        });
        break;
      case 'Departman za tehničke nauke':
        this.setState({
          profileItems: [
            {
              label: 'Arhitektura',
              value: 'Arhitektura',
            },
            {
              label: 'Građevinarstvo',
              value: 'Građevinarstvo',
            },
            {
              label: 'Računarska tehnika',
              value: 'Računarska tehnika',
            },
            {
              label: 'Audio i video tehnologije',
              value: 'Audio i video tehnologije',
            },
            {
              label: 'Softversko inženjerstvo',
              value: 'Softversko inženjerstvo',
            },
          ],
        });
        break;
      case 'Departman za hemijsko-tehnološke nauke':
        this.setState({
          profileItems: [
            {
              label: 'Hemija',
              value: 'Hemija',
            },
            {
              label: 'Poljoprivredna proizvodnja',
              value: 'Poljoprivredna proizvodnja',
            },
          ],
        });
        break;
      case 'Departman za biomedicinske nauke':
        this.setState({
          profileItems: [
            {
              label: 'Biologija',
              value: 'Biologija',
            },
            {
              label: 'Rehabiliacija',
              value: 'Rehabiliacija',
            },
            {
              label: 'Sport i fizičko vaspitanje',
              value: 'Sport i fizičko vaspitanje',
            },
          ],
        });
        break;
      case 'Departman za umetnost':
        this.setState({
          profileItems: [
            {
              label: 'Likovna umetnost',
              value: 'Likovna umetnost',
            },
          ],
        });
        break;
      case 'Departman za multidisciplinarne nauke':
        this.setState({
          profileItems: [
            {
              label: 'Menadžment u visokom obrazovanju',
              value: 'Menadžment u visokom obrazovanju',
            },
            {
              label: 'Energetska efikasnost u zgradarstvu',
              value: 'Energetska efikasnost u zgradarstvu',
            },
            {
              label:
                'Energetska efikasnost, obnovljivi izvori energije i uticaj na životnu sredinu',
              value:
                'Energetska efikasnost, obnovljivi izvori energije i uticaj na životnu sredinu',
            },
          ],
        });
        break;
      case 'Departman za biotehničke nauke u Sjenici':
        this.setState({
          profileItems: [
            {
              label: 'Prehrambena tehnologija',
              value: 'Agronomija',
            },
          ],
        });
        break;
      default:
        break;
    }
  }

  registerProfessor() {
    const { email, password, name_surname, DoBPost } = this.state;

    if (email == '' || password == '' || name_surname == '' || DoBPost == '') {
      Alert.alert(
        'Greška',
        'Molimo Vas da ispunite sva polja!',
        [{ text: 'Okej' }],
        { cancelable: false }
      );
    } else if (!name_surname.includes(' ')) {
      Alert.alert(
        'Greška',
        'Unesite ispravan format imena i prezimena!',
        [{ text: 'Okej' }],
        { cancelable: false }
      );
    } else {
      this.setState({ loading: true });

      var spliter = name_surname.split(' ');
      var name = spliter[0];
      var surname = spliter[1];

      axios
        .post('https://blooming-castle-17380.herokuapp.com/user/register', {
          email: email,
          password: password,
          name: name,
          surname: surname,
          DoB: DoBPost,
          account_type: 'Profesor',
        })
        .then((response) => {
          // Handle the JWT response here
          console.log('response je ' + response);
          this.setState({ loading: false });
        })
        .catch((error) => {
          // Handle returned errors here
          console.log(error.response.data);
          this.onRegistrationFail(error.response.data);
          this.setState({ loading: false });
        });
    }
  }

  registerStudent() {
    const {
      username,
      password,
      email,
      name_surname,
      DoBPost,
      studentIdNo,
      department,
      profile,
      grade,
      loading,
    } = this.state;

    if (
      email == '' ||
      password == '' ||
      name_surname == '' ||
      DoBPost == '' ||
      studentIdNo == '' ||
      department == '' ||
      profile == '' ||
      grade == ''
    ) {
      Alert.alert(
        'Greška',
        'Molimo Vas da ispunite sva polja!',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
    } else if (!name_surname.includes(' ')) {
      Alert.alert(
        'Greška',
        'Unesite ispravan format imena i prezimena!',
        [{ text: 'Okej' }],
        { cancelable: false }
      );
    } else {
      this.setState({ loading: true });

      var spliter = name_surname.split(' ');
      var name = spliter[0];
      var surname = spliter[1];

      axios
        .post('https://blooming-castle-17380.herokuapp.com/user/register', {
          email: email,
          password: password,
          name: name,
          surname: surname,
          DoB: DoBPost,
          studentIdNo: studentIdNo,
          department: department,
          profile: profile,
          grade: grade,
          account_type: 'Student',
        })
        .then((response) => {
          // Handle the JWT response here
          console.log('response je ' + response);
          this.setState({ loading: false });
        })
        .catch((error) => {
          // Handle returned errors here
          console.log(error.response.data);
          this.onRegistrationFail(error.response.data);
          this.setState({ loading: false });
        });
    }
  }

  onRegistrationFail(error) {
    if (error == '"email" must be a valid email') {
      error = 'Pogrešan format email adrese!';
    } else if (
      error == '"password" length must be at least 6 characters long'
    ) {
      error = 'Lozinka mora imati najmanje 6 karaktera!';
    }
    Alert.alert('Greška!', error, [{ text: 'OK' }], { cancelable: false });
  }

  render() {
    const {
      registerType,
      username,
      password,
      email,
      name_surname,
      DoB,
      studentIdNo,
      department,
      profile,
      grade,
      datePickerVisible,
      loading,
    } = this.state;
    const {
      registerTypeContainer,
      imageContainer,
      stretch,
      registerButtonContainer,
      registerTypeButton,
      registerTypeButtonText,
      registerScreen,
      headerContainer,
      header,
      formContainer,
      form,
      section,
      registerButton,
      spinnerStyle,
      footer,
    } = styles;

    if (registerType === '') {
      return (
        <View style={registerTypeContainer}>
          <View style={imageContainer}>
            <Image
              style={stretch}
              source={require('./LOGO_LATINICA_LINE-1.png')}
            />
          </View>
          <View style={registerButtonContainer}>
            <Button
              style={registerTypeButton}
              txtStyle={registerTypeButtonText}
              onPress={() => this.setState({ registerType: 'Profesor' })}
            >
              Registrujte se kao profesor
            </Button>
            <Button
              style={registerTypeButton}
              txtStyle={registerTypeButtonText}
              onPress={() => this.setState({ registerType: 'Student' })}
            >
              Registrujte se kao student
            </Button>
          </View>
          <View style={footer}>
            <TextLink onPress={this.props.authSwitch}>
              Već imate korisnički nalog? Prijavite se!
            </TextLink>
          </View>
        </View>
      );
    } else if (registerType === 'Profesor') {
      return (
        <View style={registerScreen}>
          <View style={formContainer}>
            <View style={headerContainer}>
              <Heading style={header}>Registracija profesora</Heading>
            </View>
            <View>
              <View style={section}>
                <Input
                  value={email}
                  placeholder="Email adresa"
                  keyboardType={'email-address'}
                  autoCapitalize={'none'}
                  onChangeText={(email) => this.setState({ email })}
                />
              </View>
              <View style={section}>
                <Input
                  value={password}
                  placeholder="Lozinka"
                  secureTextEntry
                  onChangeText={(password) => this.setState({ password })}
                />
              </View>

              <View style={section}>
                <Input
                  placeholder="Ime i prezime"
                  value={name_surname}
                  onChangeText={(name_surname) =>
                    this.setState({ name_surname })
                  }
                />
              </View>
              <View style={section}>
                <DatePickerInput
                  placeholder="Datum rođenja"
                  value={DoB}
                  onPress={this.showDatePicker}
                ></DatePickerInput>
              </View>
              <DateTimePickerModal
                isVisible={datePickerVisible}
                mode="date"
                isDarkModeEnabled={false}
                onCancel={this.hideDatePicker}
                onConfirm={(date) => {
                  this.confirmDatePicker(date);
                }}
              />
            </View>
            {!loading ? (
              <Button style={registerButton} onPress={this.registerProfessor}>
                Registracija
              </Button>
            ) : (
              <Loading
                size={'large'}
                style={spinnerStyle}
                spinnerStyle={{ paddingTop: 5 }}
              />
            )}
          </View>
          <View style={footer}>
            <TextLink onPress={this.props.authSwitch}>
              Već imate korisnički nalog? Prijavite se!
            </TextLink>
          </View>
        </View>
      );
    } else if (registerType === 'Student') {
      return (
        <View style={registerScreen}>
          <SafeAreaView style={formContainer}>
            <View style={headerContainer}>
              <Heading style={header}>Registracija studenta</Heading>
            </View>
            <KeyboardAvoidingView style={form} behavior={'padding'} enabled>
              <ScrollView>
                <View style={section}>
                  <Input
                    value={email}
                    placeholder="Email adresa"
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                    onChangeText={(email) => this.setState({ email })}
                  />
                </View>
                <View style={section}>
                  <Input
                    value={password}
                    placeholder="Lozinka"
                    secureTextEntry
                    onChangeText={(password) => this.setState({ password })}
                  />
                </View>
                <View style={section}>
                  <Input
                    placeholder="Ime i prezime"
                    value={name_surname}
                    onChangeText={(name_surname) =>
                      this.setState({ name_surname })
                    }
                  />
                </View>

                <View
                  style={{
                    ...(Platform.OS !== 'android' && {
                      zIndex: 10,
                    }),
                  }}
                >
                  <DropDown
                    items={[
                      {
                        label: 'Departman za pravne nauke',
                        value: 'Departman za pravne nauke',
                      },
                      {
                        label: 'Departman za ekonomske nauke',
                        value: 'Departman za ekonomske nauke',
                      },
                      {
                        label: 'Departman za filološke nauke',
                        value: 'Departman za filološke nauke',
                      },
                      {
                        label: 'Departman za filozofske nauke',
                        value: 'Departman za filozofske nauke',
                      },
                      {
                        label: 'Departman za matematičke nauke',
                        value: 'Departman za matematičke nauke',
                      },
                      {
                        label: 'Departman za tehničke nauke',
                        value: 'Departman za tehničke nauke',
                      },
                      {
                        label: 'Departman za hemijsko-tehnološke nauke',
                        value: 'Departman za hemijsko-tehnološke nauke',
                      },
                      {
                        label: 'Departman za biomedicinske nauke',
                        value: 'Departman za biomedicinske nauke',
                      },
                      {
                        label: 'Departman za umetnost',
                        value: 'Departman za umetnost',
                      },
                      {
                        label: 'Departman za multidisciplinarne nauke',
                        value: 'Departman za multidisciplinarne nauke',
                      },
                      {
                        label: 'Departman za biotehničke nauke u Sjenici',
                        value: 'Departman za biotehničke nauke u Sjenici',
                      },
                    ]}
                    placeholder={'Izaberite departman'}
                    containerPropStyle={{
                      marginHorizontal: 20,
                      marginVertical: 6,
                    }}
                    onChange={(item) => {
                      this.setState({ department: item.value }, () => {
                        this.updateProfileData();
                      });
                    }}
                  />
                </View>
                <View
                  style={{
                    ...(Platform.OS !== 'android' && {
                      zIndex: 8,
                    }),
                  }}
                >
                  <DropDown
                    items={this.state.profileItems}
                    placeholder={'Izaberite smer'}
                    containerPropStyle={{
                      marginHorizontal: 20,
                      marginVertical: 6,
                    }}
                    disabled={department == '' ? true : false}
                    onChange={(item) => {
                      this.setState({ profile: item.value });
                    }}
                  />
                </View>

                <View
                  style={{
                    ...(Platform.OS !== 'android' && {
                      zIndex: 7,
                    }),
                  }}
                >
                  <DropDown
                    items={[
                      { label: '1.', value: '1.' },
                      { label: '2.', value: '2.' },
                      { label: '3.', value: '3.' },
                      { label: '4.', value: '4.' },
                    ]}
                    placeholder={'Izaberite godinu studija'}
                    containerPropStyle={{
                      marginHorizontal: 20,
                      marginVertical: 6,
                    }}
                    onChange={(item) => {
                      this.setState({ grade: item.value });
                    }}
                  />
                </View>
                <View style={section}>
                  <DatePickerInput
                    value={DoB}
                    onPress={this.showDatePicker}
                  ></DatePickerInput>
                </View>
                <View style={section}>
                  <Input
                    placeholder="Broj indeksa"
                    value={studentIdNo}
                    onChangeText={(studentIdNo) =>
                      this.setState({ studentIdNo })
                    }
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

            {!loading ? (
              <Button style={registerButton} onPress={this.registerStudent}>
                Registracija
              </Button>
            ) : (
              <Loading
                size={'large'}
                style={spinnerStyle}
                spinnerStyle={{ paddingTop: 5 }}
              />
            )}

            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              isDarkModeEnabled={false}
              style={{ backgroundColor: 'white', borderColor: 'white' }}
              onCancel={this.hideDatePicker}
              onConfirm={(date) => {
                this.confirmDatePicker(date);
              }}
            />
          </SafeAreaView>
          <View style={footer}>
            <TextLink onPress={this.props.authSwitch}>
              Već imate korisnički nalog? Prijavite se!
            </TextLink>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  registerTypeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  imageContainer: { flex: 2, width: '100%' },
  stretch: {
    alignSelf: 'center',
    height: '60%',
    width: '89%',
    marginTop: 50,
    marginBottom: 20,
    resizeMode: 'stretch',
  },
  registerButtonContainer: {
    flex: 6,
    width: '100%',
    justifyContent: 'center',
  },
  registerTypeButton: {
    flexDirection: 'row',
    height: '12%',
    marginBottom: 50,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  registerTypeButtonText: {
    paddingTop: 20,
  },
  registerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  headerContainer: {
    width: '100%',
    marginBottom: 25,
  },
  header: {
    fontSize: 36,
    color: 'rgb(27,41,69)',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 15,
  },
  form: {
    height: '70%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    marginVertical: 6,
    marginHorizontal: 20,
  },
  registerButton: {
    height: 50,
    width: 370,
    marginTop: 25,
  },
  spinnerStyle: {
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: 'rgb(27,41,69)',
    borderRadius: 25,
    height: 50,
    width: 370,
    marginTop: 20,
  },
  footer: {
    height: '10%',
    backgroundColor: 'rgb(27,41,69)',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'orange',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});

export { Register };
