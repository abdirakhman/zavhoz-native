import React from 'react';
import * as Font from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Button
 } from 'react-native';
import { StackNavigator } from 'react-navigation';
import GLOBALS from '../Globals';
import deviceStorage from '../components/deviceStorage';
import DatePicker from 'react-native-datepicker'

export default class EditThing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsLoaded : false,
      responsible : {},
      place : {},
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    let val = await deviceStorage.retrieveItem('access_token');
    const { navigation } = this.props;
    let kek = navigation.getParam('id', '0');
    return fetch(
      GLOBALS.BASE_URL + '/zavhoz/request.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + val.toString(),
        },
        body: 'id=' + kek,
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            assetsLoaded: true,
            dataSource: responseJson,
          },
          function() {}
        );
        this.setState(prevState => ({
          responsible : {
            ...prevState.responsible,
            name : responseJson.responsible,
            id : responseJson.responsible_id,
          }
        }));
        this.setState(prevState => ({
          place : {
            ...prevState.place,
            name : responseJson.place,
            id : responseJson.place_id,
          }
        }));

      })
      .done();
  }

  _returnDataResponsible = (_id, _name) => {
    this.setState(prevState => ({
      responsible: {
        ...prevState.responsible,
        name: _name,
        id : _id,
      }
    }));
  }
  _returnDataPlace = (_id, _name) => {
    this.setState(prevState => ({
      place: {
        ...prevState.place,
        name: _name,
        id : _id,
      }
    }));
  }

  render() {
    if (!this.state.assetsLoaded) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#74B43F"/>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>Editing the item</Text>
          <TextInput
          placeholder="Initial cost"
          style={styles.textInput}
          editable={false}
          value={this.state.dataSource.init_cost.toString()}
          />
          <TextInput
          placeholder="Aromatization cost"
          style={styles.textInput}
          editable={false}
          value={this.state.dataSource.arom_price.toString()}
          />
          <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SelectResponsible', {callback : this._returnDataResponsible})}
              style={styles.buttonInput}
          >
          {this.state.responsible.name ? (
          <Text style={styles.chooseText}>
          {this.state.responsible.name}
          </Text>
          ) : (
            <Text style={[styles.chooseText, {color : '#C7C7CD'}]}>
            {'Choose a responsible'}
            </Text>
          ) }

          </TouchableOpacity>

          <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SelectPlace', {callback : this._returnDataPlace})}
              style={styles.buttonInput}
          >
          {this.state.place.name ? (
          <Text style={styles.chooseText}>
          {this.state.place.name}
          </Text>
          ) : (
            <Text style={[styles.chooseText, {color : '#C7C7CD'}]}>
            {'Choose a room'}
            </Text>
          ) }
          </TouchableOpacity>
          <DatePicker
            style={styles.datePicker}
            customStyles= {{
              placeholderText : {
                fontFamily : 'Electrolize',
                alignSelf: 'stretch',
                padding: 10,
              },
              dateText : {
                alignSelf: 'stretch',
                padding: 10,
                fontFamily : 'Electrolize',
              },
              dateInput : {
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
                borderWidth : 1,
                textAlign : 'right',
                borderColor: 'gray',
              }
            }}
            date={this.state.dataSource.date}
            mode="date"
            disabled={true}
            placeholder="Select date"
            format="YYYY-MM-DD"
            minDate="2000-01-01"
            showIcon={false}
            maxDate="2050-01-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => {this.setState({date: date})}}
          />
          <TextInput
          placeholder="Name"
          style={styles.textInput}
          value={this.state.dataSource.name}
          editable={false}
          />
          <TextInput
          placeholder="The expiration (months)"
          style={styles.textInput}
          editable={false}
          value={this.state.dataSource.month_expired.toString()}
          />
          <TouchableOpacity style={styles.btn} onPress={this._handleedit}>
            <Text style={styles.buttonText}>EDIT</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  _handleedit = async () => {
    if (this.state.dataSource.responsible_id === this.state.responsible.id.toString() &&
      this.state.dataSource.place_id === this.state.place.id.toString()) {
      alert("Nothing to change");
      return;
    }
    // Validation of input
    let val = await deviceStorage.retrieveItem('access_token');
    const { navigation } = this.props;
    let kek = navigation.getParam('id', '0');
    fetch(GLOBALS.BASE_URL + '/zavhoz/update.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + val.toString(),
      },
      body: 'id=' + kek + '&responsible=' + this.state.responsible.id + '&place='
      + this.state.place.id,
    })
    .then(response => response.json())
    .then(res => {
        if (res.error === "no error") {
            alert("Operation successful.");
        } else {
          alert(res.error);
        }
    })
    .catch((err) => {
      alert(err);
    })
    .done();
  }
}



const styles = StyleSheet.create({
  title : {
    marginBottom : 20,
    fontFamily : 'Electrolize',
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  datePicker : {
    width : 200,
    height: 40,
    borderColor: 'gray',
    marginBottom: 20,
  },
  buttonInput : {
    width : 200,
    fontFamily : 'Electrolize',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    justifyContent : 'center',
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  textInput : {
    width : 200,
    fontFamily : 'Electrolize',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  btn : {
    borderWidth : 1,
    borderColor : 'gray',
    paddingHorizontal : 20,
    alignItems : 'center',
    padding : 5,
    backgroundColor : '#74B43F',
  },
  buttonText : {
    color : 'white',
    fontFamily : 'Electrolize',
  },
  chooseText : {
    fontFamily : 'Electrolize',
  }
});
