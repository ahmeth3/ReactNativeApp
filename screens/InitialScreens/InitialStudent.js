import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Card, Button, GradeButton } from '../../components/common';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const STATUS_BAR = StatusBar.statusBarHeight || 24;

export default class InitialStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedSubjects: [],
      chosenGrade: '',
    };
    this.selectedSubjects = [];

    this.fetchSubject = this.fetchSubject.bind(this);
    this.updateSubjects = this.updateSubjects.bind(this);

    this.fetchSubject('0.', '4');
  }

  fetchSubject(grade) {
    axios
      .post(
        `https://blooming-castle-17380.herokuapp.com/subject/fetchByCriteriaStudent/${this.props.jwt}`,
        { grade: grade }
      )
      .then((response) => {
        console.log(response.data.grade);
        this.setState({
          fetchedSubjects: response.data.subjects,
          chosenGrade: response.data.grade,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateSubjects(grade) {
    axios
      .patch(
        `https://blooming-castle-17380.herokuapp.com/student/update-subjects/${this.props.jwt}`,
        { subjects: this.selectedSubjects }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onPressHandler(id) {
    let renderData = [...this.state.fetchedSubjects];
    for (let data of renderData) {
      if (data._id == id) {
        data.selected = data.selected == null ? true : !data.selected;
        // ako je izabran da se ubaci u niz selectedsubjects,
        //ako nije onda da se proveri da li je u tom nizu i da se izbaci
        if (!this.selectedSubjects.includes(data._id)) {
          this.selectedSubjects.push(data._id);
        } else {
          this.selectedSubjects = this.selectedSubjects.filter(
            (item) => item != data._id
          );
        }
        break;
      }
    }
    this.setState({ fetchSubject: renderData });
    console.log(this.selectedSubjects);
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: STATUS_BAR * 1.5,
            width: '100%',
          }}
        ></View>
        <Text style={[styles.headerText]}>
          Odaberite predmete iz sledećih godina studija:
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <GradeButton
            style={[styles.registerButton, { minHeight: 60 }]}
            onPress={() => this.fetchSubject('1.')}
          >
            <MaterialCommunityIcons
              size={30}
              {...(this.state.chosenGrade == '1.'
                ? {
                    color: 'white',
                    name: 'numeric-1-box',
                  }
                : {
                    color: 'orange',
                    name: 'numeric-1-box-outline',
                  })}
            />
          </GradeButton>
          <GradeButton
            style={styles.registerButton}
            onPress={() => this.fetchSubject('2.')}
          >
            <MaterialCommunityIcons
              size={30}
              {...(this.state.chosenGrade == '2.'
                ? {
                    color: 'white',
                    name: 'numeric-2-box',
                  }
                : {
                    color: 'orange',
                    name: 'numeric-2-box-outline',
                  })}
            />
          </GradeButton>
          <GradeButton
            style={styles.registerButton}
            onPress={() => this.fetchSubject('3.')}
          >
            <MaterialCommunityIcons
              size={30}
              {...(this.state.chosenGrade == '3.'
                ? {
                    color: 'white',
                    name: 'numeric-3-box',
                  }
                : {
                    color: 'orange',
                    name: 'numeric-3-box-outline',
                  })}
            />
          </GradeButton>
          <GradeButton
            style={styles.registerButton}
            onPress={() => this.fetchSubject('4.')}
          >
            <MaterialCommunityIcons
              size={30}
              {...(this.state.chosenGrade == '4.'
                ? {
                    color: 'white',
                    name: 'numeric-4-box',
                  }
                : {
                    color: 'orange',
                    name: 'numeric-4-box-outline',
                  })}
            />
          </GradeButton>
        </View>

        <FlatList
          //horizontal={true}
          data={this.state.fetchedSubjects}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.onPressHandler(item._id)}>
              <Card
                style={
                  this.selectedSubjects.includes(item._id)
                    ? {
                        padding: 10,
                        borderRadius: 5,
                        borderColor: 'white',
                        flexDirection: 'row',
                      }
                    : {
                        padding: 10,
                        borderRadius: 5,
                        borderColor: 'orange',
                        flexDirection: 'row',
                      }
                }
              >
                <Text style={[styles.cardText, { flex: 3, marginLeft: 10 }]}>
                  {item.name}
                </Text>
                <MaterialIcons
                  size={30}
                  {...(this.selectedSubjects.includes(item._id)
                    ? {
                        color: 'white',
                        name: 'check-box',
                      }
                    : {
                        color: 'white',
                        name: 'check-box-outline-blank',
                      })}
                />
              </Card>
            </TouchableOpacity>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        />
        <SafeAreaView>
          <Button
            style={styles.checkButton}
            txtStyle={{ paddingTop: 15 }}
            onPress={() => this.updateSubjects()}
          >
            Izaberite predmete
          </Button>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  registerButton: {},
  checkButton: {
    height: 60,
    width: 250,
  },
  color: {
    color: 'blue',
  },
});
