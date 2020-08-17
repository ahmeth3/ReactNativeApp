import React, { Component } from 'react';
import { View, Text, StyleSheet, Fragment } from 'react-native';
import { Login, Register } from '../components/auth';

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: true,
    };

    this.authSwitch = this.authSwitch.bind(this);
    this.switchForm = this.switchForm.bind(this);
  }

  authSwitch() {
    this.setState({ showLogin: !this.state.showLogin });
  }

  switchForm() {
    if (!this.state.showLogin) {
      return <Register authSwitch={this.authSwitch} />;
    } else {
      return <Login newJWT={this.props.newJWT} authSwitch={this.authSwitch} />;
    }
  }

  render() {
    const { container } = styles;
    return <View style={container}>{this.switchForm()}</View>;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
});
