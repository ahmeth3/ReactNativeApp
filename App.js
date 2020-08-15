import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Loading } from './components/common';
import Auth from './screens/Auth';
import LoggedIn from './screens/LoggedIn';

import tokenStorage from './services/tokenStorage';
import axios from 'axios';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
    };

    this.newJWT = this.newJWT.bind(this);
    this.deleteJWT = tokenStorage.deleteJWT.bind(this);
    this.loadJWT = tokenStorage.loadJWT.bind(this);

    this.loadJWT();
  }

  newJWT(jwt) {
    this.setState({ jwt: jwt });
    this.loadJWT();
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Loading size={'large'} />
        </View>
      );
    } else if (!this.state.jwt) {
      return <Auth newJWT={this.newJWT} />;
    } else if (this.state.jwt) {
      return (
        <LoggedIn
          deleteJWT={this.deleteJWT}
          jwt={this.state.jwt}
          account_type={this.state.account_type}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
