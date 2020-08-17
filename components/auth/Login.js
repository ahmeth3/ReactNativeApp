import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Input, TextLink, Button, Loading, Heading } from '../common';
import axios from 'axios';
import tokenStorage from '../../services/tokenStorage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', loading: false };
    this.image = require('./LOGO_LATINICA_LINE-1.png');

    this.loginStudent = this.loginStudent.bind(this);
  }

  loginStudent() {
    const { email, password, loading } = this.state;

    if (email == '' || password == '') {
      Alert.alert(
        'Greška',
        'Molimo Vas da ispunite sva polja!',
        [{ text: 'Okej' }],
        { cancelable: false }
      );
    } else {
      this.setState({ loading: true });

      axios
        .post('https://blooming-castle-17380.herokuapp.com/user/login', {
          email: email,
          password: password,
        })
        .then((response) => {
          // Handle the JWT response here
          tokenStorage.saveItem('id_token', response.data);
          this.setState({ loading: false });
          this.props.newJWT(response.data);
        })
        .catch((error) => {
          // Handle returned errors here
          this.onLoginFail(error.response.data);
          this.setState({ loading: false });
        });
    }
  }

  onLoginFail(error) {
    if (error == '"email" must be a valid email') {
      error = 'Pogrešan format email adrese!';
    } else if (
      error == '"password" length must be at least 6 characters long'
    ) {
      error = 'Pogrešna lozinka!';
    }
    Alert.alert('Greška!', error, [{ text: 'OK' }], { cancelable: false });
  }

  render() {
    const { email, password, loading } = this.state;
    const {
      registerTypeContainer,
      imageContainer,
      stretch,
      formContainer,
      headerContainer,
      header,
      form,
      section,
      registerButton,
      spinnerStyle,
      footer,
    } = styles;
    return (
      <View style={registerTypeContainer}>
        <View style={imageContainer}>
          <Image style={stretch} source={this.image} />
        </View>
        <View style={formContainer}>
          <View style={headerContainer}>
            <Heading style={header}>Prijava</Heading>
          </View>
          <View style={form}>
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
                secureTextEntry
                placeholder="Lozinka"
                onChangeText={(password) => this.setState({ password })}
              />
            </View>
          </View>
          {!loading ? (
            <Button style={registerButton} onPress={this.loginStudent}>
              Prijava
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
            Nemate korisnički nalog? Registrujte se!
          </TextLink>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  registerTypeContainer: {
    flex: 1,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: { flex: 2, width: '100%' },
  stretch: {
    alignSelf: 'center',
    height: '60%',
    width: '89%',
    marginTop: 50,
    marginBottom: 20,
    resizeMode: 'stretch',
    marginRight: 5,
  },
  formContainer: {
    flex: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 15,
    paddingTop: 60,
  },
  headerContainer: {
    width: '100%',
    marginBottom: 25,
  },
  header: {
    fontSize: 42,
    color: 'rgb(27,41,69)',
  },
  form: {
    alignSelf: 'center',
  },
  section: {
    flexDirection: 'row',
    marginVertical: 6,
    marginHorizontal: 20,
  },
  registerButton: {
    height: 60,
    width: 370,
  },
  registerButton: {
    height: 50,
    width: 370,
    marginTop: 20,
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

export { Login };
