import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Card, Button } from '../../components/common';
import axios from 'axios';

export default class InitialStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedSubjects: [],
    };
    this.selectedSubjects = [];

    this.fetchSubject = this.fetchSubject.bind(this);
    this.updateSubjects = this.updateSubjects.bind(this);

    this.fetchSubject('0.');
  }

  fetchSubject(grade) {
    axios
      .post(
        `https://blooming-castle-17380.herokuapp.com/subject/fetchByCriteriaStudent/${this.props.jwt}`,
        { grade: grade }
      )
      .then((response) => {
        this.setState({ fetchedSubjects: response.data });
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
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <Button
            style={styles.registerButton}
            onPress={() => this.fetchSubject('1.')}
          >
            1.
          </Button>
          <Button
            style={styles.registerButton}
            onPress={() => this.fetchSubject('2.')}
          >
            2.
          </Button>
          <Button
            style={styles.registerButton}
            onPress={() => this.fetchSubject('3.')}
          >
            3.
          </Button>
          <Button
            style={styles.registerButton}
            onPress={() => this.fetchSubject('4.')}
          >
            4.
          </Button>
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
                        borderRadius: 5,
                        borderColor: 'green',
                      }
                    : {
                        padding: 10,
                        borderRadius: 5,
                        borderColor: 'orange',
                      }
                }
              >
                <Text style={styles.cardText}>{item.name}</Text>
              </Card>
            </TouchableOpacity>
          )}
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        />
        <Button
          style={styles.checkButton}
          onPress={() => this.updateSubjects()}
        >
          Izaberi predmete
        </Button>
      </SafeAreaView>
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
  registerButton: {
    height: 60,
    width: 60,
  },
  checkButton: {
    height: 60,
    width: 200,
  },
});
