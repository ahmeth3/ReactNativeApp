import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Loading } from '../components/common';
import InitialProfessor from './InitialScreens/InitialProfessor';
import InitialStudent from './InitialScreens/InitialStudent';
import axios from 'axios';

import MainConsultationScreen from './ConsultationScreens/MainConsultationScreen';
import EditConsultationScreen from './ConsultationScreens/EditConsulationScreen';
import AddConsultationScreen from './ConsultationScreens/AddConsultationScreen';

import MainProjectsScreen from './ProjectsScreens/MainProjectsScreen';

import MySubjects from './SubjectsScreens/MySubjects';
import EditProfessorSubjects from './SubjectsScreens/EditProfessorSubjects';
import EditStudentSubjects from './SubjectsScreens/EditStudentSubjects';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const BottomTabs = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = { screenHandler: false, loading: true };
    this.checkIfFirstLogin = this.checkIfFirstLogin.bind(this);

    this.checkIfFirstLogin();
  }

  checkIfFirstLogin() {
    var basicInfoExist = '0';
    if (this.props.account_type == 'Profesor') {
      //Basic info exist prof
      axios
        .get(
          `https://blooming-castle-17380.herokuapp.com/professor/basic-info/${this.props.jwt}`
        )
        .then((response) => {
          if (response.data == 'Nema basic info') {
            this.setState({ screenHandler: true, loading: false });
          } else this.setState({ loading: false });
        })
        .catch((error) => {
          console.log(error);
        });
      //ako exist idi na main screen za PROF, ako ne exist idi na initialprof screen
    }
    if (this.props.account_type == 'Student') {
      //Basic info exist student
      axios
        .get(
          `https://blooming-castle-17380.herokuapp.com/student/basic-info/${this.props.jwt}`
        )
        .then((response) => {
          if (response.data == 'Nema basic info') {
            this.setState({ screenHandler: true, loading: false });
          } else this.setState({ loading: false });
        })
        .catch((error) => {
          console.log(error);
        });
      //ako exist idi na main screen za studenta, ako ne exist idi na initial student screen
    }
  }

  componentDidUpdate() {
    this.checkIfFirstLogin();
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Loading size={'large'} />
        </View>
      );
    } else if (!this.state.loading && !this.state.screenHandler) {
      createSubjectsStack = () => (
        <Stack.Navigator>
          <Stack.Screen name="MySubjects" component={MySubjects} />
          <Stack.Screen
            name="EditProfessorSubjects"
            component={EditProfessorSubjects}
          />
          <Stack.Screen
            name="EditStudentSubjects"
            component={EditStudentSubjects}
          />
        </Stack.Navigator>
      );

      createConsultationsStack = () => (
        <Stack.Navigator>
          <Stack.Screen
            name="MainConsultation"
            component={MainConsultationScreen}
          />
          <Stack.Screen
            name="EditConsultation"
            component={EditConsultationScreen}
          />
          <Stack.Screen
            name="AddConsultation"
            component={AddConsultationScreen}
          />
        </Stack.Navigator>
      );
      
      return (
        <NavigationContainer>
          <Drawer.Navigator>
            <Drawer.Screen
              name="Consultation"
              children={createConsultationsStack}
            />
            <Drawer.Screen name="Projects" component={MainProjectsScreen} />
            <Drawer.Screen name="Subjects" children={createSubjectsStack} />
          </Drawer.Navigator>
        </NavigationContainer>
      );
    } else if (this.state.screenHandler) {
      if (this.props.account_type == 'Profesor')
        return <InitialProfessor jwt={this.props.jwt} />;
      if (this.props.account_type == 'Student')
        return <InitialStudent jwt={this.props.jwt} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    height: 50,
    width: 250,
  },
});
