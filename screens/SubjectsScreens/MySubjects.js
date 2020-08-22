import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Fragment,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
} from 'react-native';
import { Card, Button } from '../../components/common';
import tokenStorage from '../../services/tokenStorage';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class MySubjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedSubjects: [],
      jwt: '',
      account_type: '',
      count: 1,
    };
    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
      this.loadJWT();
    }, 1000);
    this.focusListener = '';
    this.fetchMySubjects = this.fetchMySubjects.bind(this);

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: 'rgb(27,41,69)',
      },
      headerTitle: 'Moji predmeti',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            var selectedSubjects = [];
            for (var i = 0; i < this.state.fetchedSubjects.length; i++) {
              selectedSubjects.push(this.state.fetchedSubjects[i]._id);
            }
            if (this.state.account_type == 'Profesor') {
              this.props.navigation.navigate('EditProfessorSubjects', {
                jwt: this.state.jwt,
                selectedSubjects: selectedSubjects,
              });
            } else if (this.state.account_type == 'Student') {
              this.props.navigation.navigate('EditStudentSubjects', {
                jwt: this.state.jwt,
                selectedSubjects: selectedSubjects,
              });
            }
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            width: 70,
          }}
        >
          <Text style={{ fontSize: 14, color: 'white' }}>Izmenite</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
          }}
          onPress={() => {
            this.props.navigation.toggleDrawer();
          }}
        >
          <AntDesign name="bars" style={{ color: 'white', fontSize: 28 }} />
        </TouchableOpacity>
      ),
    });

    this.loadJWT();
  }

  async loadJWT() {
    try {
      const value = await AsyncStorage.getItem('id_token');
      if (value !== null) {
        //ovde da zovnem backend i validira token
        axios
          .post(
            `https://blooming-castle-17380.herokuapp.com/user/login/${value}`
          )
          .then((response) => {
            this.setState(
              {
                jwt: value,
                loading: false,
                account_type: response.data,
              },
              () => {
                this.fetchMySubjects();
              }
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
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

  fetchMySubjects() {
    var url = '';
    if (this.state.account_type == 'Profesor') {
      url = `https://blooming-castle-17380.herokuapp.com/professor/mySubjects/${this.state.jwt}`;
    } else if (this.state.account_type == 'Student') {
      url = `https://blooming-castle-17380.herokuapp.com/student/mySubjects/${this.state.jwt}`;
    }
    axios
      .get(url)
      .then((response) => {
        this.setState({ fetchedSubjects: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.center}>
        <FlatList
          data={this.state.fetchedSubjects}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {}}>
              <Card
                style={{
                  padding: 10,
                  borderRadius: 5,
                  borderColor: 'orange',
                  flexDirection: 'row',
                }}
              >
                <Text style={[styles.cardText, { flex: 3, marginLeft: 10 }]}>
                  {item.name}
                </Text>
              </Card>
            </TouchableOpacity>
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
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
