import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import { Card, Button, DropDown, GradeButton } from '../../components/common';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const STATUS_BAR = StatusBar.statusBarHeight || 24;

export default class EditProfessorSubjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedSubjects: [],
      department: '',
      profile: '',
      profileItems: [],
      chosenGrade: '',
    };

    this.jwt = this.props.route.params.jwt;
    this.selectedSubjects = this.props.route.params.selectedSubjects;

    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: 'rgb(27,41,69)',
      },
      headerTitle: 'Izmena predmeta',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
      headerBackTitle: 'Nazad',
    });

    this.fetchSubject = this.fetchSubject.bind(this);
    this.updateSubjects = this.updateSubjects.bind(this);
  }

  updateProfileData() {
    const { department } = this.state;
    switch (department) {
      case 'Departman za pravne nauke':
        this.setState({
          profileItems: [
            {
              label: 'Pravo',
              value: 'Pravo',
            },
          ],
        });
        break;
      case 'Departman za ekonomske nauke':
        this.setState({
          profileItems: [
            {
              label: 'Ekonomija',
              value: 'Ekonomija',
            },
            {
              label: 'Poslovna informatika',
              value: 'Poslovna informatika',
            },
          ],
        });
        break;
      case 'Departman za filozofske nauke':
        this.setState({
          profileItems: [
            {
              label: 'Psihologija',
              value: 'Psihologija',
            },
            {
              label: 'Vaspitač u predškolskim ustanovama',
              value: 'Vaspitač u predškolskim ustanovama',
            },
          ],
        });
        break;
      case 'Departman za filološke nauke':
        this.setState({
          profileItems: [
            {
              label: 'Srpski jezik i književnost',
              value: 'Srpski jezik i književnost',
            },
            {
              label: 'Engleski jezik i književnost',
              value: 'Engleski jezik i književnost',
            },
          ],
        });
        break;
      case 'Departman za matematičke nauke':
        this.setState({
          profileItems: [
            {
              label: 'Matematika',
              value: 'Matematika',
            },
            {
              label: 'Matematika i fizika',
              value: 'Matematika i fizika',
            },
            {
              label: 'Informatika i matematika',
              value: 'Informatika i matematika',
            },
            {
              label: 'Informatika i fizika',
              value: 'Informatika i fizika',
            },
          ],
        });
        break;
      case 'Departman za tehničke nauke':
        this.setState({
          profileItems: [
            {
              label: 'Arhitektura',
              value: 'Arhitektura',
            },
            {
              label: 'Građevinarstvo',
              value: 'Građevinarstvo',
            },
            {
              label: 'Računarska tehnika',
              value: 'Računarska tehnika',
            },
            {
              label: 'Audio i video tehnologije',
              value: 'Audio i video tehnologije',
            },
            {
              label: 'Softversko inženjerstvo',
              value: 'Softversko inženjerstvo',
            },
          ],
        });
        break;
      case 'Departman za hemijsko-tehnološke nauke':
        this.setState({
          profileItems: [
            {
              label: 'Hemija',
              value: 'Hemija',
            },
            {
              label: 'Poljoprivredna proizvodnja',
              value: 'Poljoprivredna proizvodnja',
            },
          ],
        });
        break;
      case 'Departman za biomedicinske nauke':
        this.setState({
          profileItems: [
            {
              label: 'Biologija',
              value: 'Biologija',
            },
            {
              label: 'Rehabiliacija',
              value: 'Rehabiliacija',
            },
            {
              label: 'Sport i fizičko vaspitanje',
              value: 'Sport i fizičko vaspitanje',
            },
          ],
        });
        break;
      case 'Departman za umetnost':
        this.setState({
          profileItems: [
            {
              label: 'Likovna umetnost',
              value: 'Likovna umetnost',
            },
          ],
        });
        break;
      case 'Departman za multidisciplinarne nauke':
        this.setState({
          profileItems: [
            {
              label: 'Menadžment u visokom obrazovanju',
              value: 'Menadžment u visokom obrazovanju',
            },
            {
              label: 'Energetska efikasnost u zgradarstvu',
              value: 'Energetska efikasnost u zgradarstvu',
            },
            {
              label:
                'Energetska efikasnost, obnovljivi izvori energije i uticaj na životnu sredinu',
              value:
                'Energetska efikasnost, obnovljivi izvori energije i uticaj na životnu sredinu',
            },
          ],
        });
        break;
      case 'Departman za biotehničke nauke u Sjenici':
        this.setState({
          profileItems: [
            {
              label: 'Prehrambena tehnologija',
              value: 'Agronomija',
            },
          ],
        });
        break;
      default:
        break;
    }
  }

  fetchSubject(grade) {
    const { department, profile } = this.state;

    if (department == '' || profile == '') {
      Alert.alert(
        'Greška',
        'Molimo Vas izaberete departman i smer!',
        [{ text: 'Okej' }],
        { cancelable: false }
      );
    } else {
      axios
        .post(
          `https://blooming-castle-17380.herokuapp.com/subject/fetchByCriteriaProfessor/${this.jwt}`,
          {
            department: this.state.department,
            profile: this.state.profile,
            grade: grade,
          }
        )
        .then((response) => {
          this.setState({ fetchedSubjects: response.data, chosenGrade: grade });

          console.log(this.passedSubjects);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  updateSubjects(grade) {
    axios
      .patch(
        `https://blooming-castle-17380.herokuapp.com/professor/update-subjects/${this.jwt}`,
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
            ...(Platform.OS !== 'android' && {
              zIndex: 12,
            }),
            width: '100%',
          }}
        >
          <View
            style={{
              ...(Platform.OS !== 'android' && {
                zIndex: 10,
              }),
            }}
          >
            <DropDown
              items={[
                {
                  label: 'Departman za pravne nauke',
                  value: 'Departman za pravne nauke',
                },
                {
                  label: 'Departman za ekonomske nauke',
                  value: 'Departman za ekonomske nauke',
                },
                {
                  label: 'Departman za filološke nauke',
                  value: 'Departman za filološke nauke',
                },
                {
                  label: 'Departman za filozofske nauke',
                  value: 'Departman za filozofske nauke',
                },
                {
                  label: 'Departman za matematičke nauke',
                  value: 'Departman za matematičke nauke',
                },
                {
                  label: 'Departman za tehničke nauke',
                  value: 'Departman za tehničke nauke',
                },
                {
                  label: 'Departman za hemijsko-tehnološke nauke',
                  value: 'Departman za hemijsko-tehnološke nauke',
                },
                {
                  label: 'Departman za biomedicinske nauke',
                  value: 'Departman za biomedicinske nauke',
                },
                {
                  label: 'Departman za umetnost',
                  value: 'Departman za umetnost',
                },
                {
                  label: 'Departman za multidisciplinarne nauke',
                  value: 'Departman za multidisciplinarne nauke',
                },
                {
                  label: 'Departman za biotehničke nauke u Sjenici',
                  value: 'Departman za biotehničke nauke u Sjenici',
                },
              ]}
              placeholder={'Izaberite departman'}
              containerPropStyle={{
                marginHorizontal: 20,
                marginVertical: 6,
              }}
              onChange={(item) => {
                this.setState({ department: item.value }, () => {
                  this.updateProfileData();
                });
              }}
            />
          </View>
          <View
            style={{
              ...(Platform.OS !== 'android' && {
                zIndex: 8,
              }),
            }}
          >
            <DropDown
              items={this.state.profileItems}
              placeholder={'Izaberite smer'}
              containerPropStyle={{
                marginHorizontal: 20,
                marginVertical: 6,
              }}
              disabled={this.state.department == '' ? true : false}
              onChange={(item) => {
                this.setState({ profile: item.value });
              }}
            />
          </View>
        </View>
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
  title: {
    fontSize: 36,
    marginBottom: 16,
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  registerButton: {},
  checkButton: {
    height: 60,
    width: 250,
  },
});
