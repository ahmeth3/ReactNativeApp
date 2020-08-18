import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Fragment,
  TouchableOpacity,
} from 'react-native';
import tokenStorage from '../../services/tokenStorage';

export default class MySubjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: '',
      loading: true,
      account_type: '',
    };

    this.loadJWT = tokenStorage.loadJWT.bind(this);

    props.navigation.setOptions({
      headerTitle: 'Moji predmeti',
      headerRight: () => (
        <TouchableOpacity onPress={() => console.log(this.state.account_type)}>
          <Text>Klikni me</Text>
        </TouchableOpacity>
      ),
    });

    this.loadJWT();
  }

  render() {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Moji predmeti</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    marginBottom: 16,
  },
});
