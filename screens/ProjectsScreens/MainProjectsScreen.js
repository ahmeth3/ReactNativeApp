import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
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
import { FlatList } from 'react-native-gesture-handler';

export default class MainProjectsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: '',
      account_type: '',
      fetchedSubjects: [],
      loading: true,
      count: 0,
    };
    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
      this.loadJWT();
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

  fetchMySubjects() {
    var url = '';
    if (this.state.account_type == 'Profesor') {
      url = `https://blooming-castle-17380.herokuapp.com/professor/projectSubjects/${this.state.jwt}`;
    } else if (this.state.account_type == 'Student') {
      url = `https://blooming-castle-17380.herokuapp.com/student/projectSubjects/${this.state.jwt}`;
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
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SpecificProjects', {
                  jwt: this.state.jwt,
                  account_type: this.state.account_type,
                  subject: item,
                });
              }}
            >
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
  title: {
    fontSize: 36,
    marginBottom: 16,
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
