import React, { Component } from 'react';
import { View, Text, StyleSheet, Fragment } from 'react-native';

export default class EditProfessorSubjects extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Profesor predmeti</Text>
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
