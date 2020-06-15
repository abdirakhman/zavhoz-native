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

export default class InsertThing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init_cost : '',
      arom_price : '',
      responsible : '',
      place : '',
      date : '',
      name : '',
      month_expired : '',
      assetsLoaded : false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    this.setState({ assetsLoaded: true });
  }

  _handleNumber = (name) => {
    return text => {
      if (/^\d+$/.test(text) === true || text == '') {
        this.setState({[name] : text});
      }
    }
  }
  _handleText = (name) => {
    return text => {
      this.setState({[name] : text});
    }
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
          <Text style={styles.title}>Adding the item</Text>
          <TextInput
          placeholder="Initial cost"
          keyboardType="number-pad"
          style={styles.textInput}
          onChangeText={this._handleNumber('init_cost')}
          value={this.state.init_cost}
          />
          <TextInput
          placeholder="Aromatization cost"
          keyboardType="number-pad"
          style={styles.textInput}
          onChangeText={this._handleNumber('arom_price')}
          value={this.state.arom_price}
          />
          <TextInput
          placeholder="Responsible"
          keyboardType="number-pad"
          style={styles.textInput}
          onChangeText={this._handleNumber('responsible')}
          value={this.state.responsible}
          />
          <TextInput
          placeholder="Room"
          keyboardType="number-pad"
          style={styles.textInput}
          onChangeText={this._handleNumber('place')}
          value={this.state.place}
          />
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
            date={this.state.date}
            mode="date"
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
          value={this.state.name}
          onChangeText={this._handleText('name')}
          />
          <TextInput
          placeholder="The expiration (months)"
          keyboardType="number-pad"
          style={styles.textInput}
          onChangeText={this._handleNumber('month_expired')}
          value={this.state.month_expired}
          />
          <TouchableOpacity style={styles.btn} onPress={this._handleinsert}>
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  _handleinsert = async () => {
    if (this.state.init_cost == '' || this.state.arom_price == '' || this.state.responsible == ''
    || this.state.place == '' || this.state.name == '' || this.month_expired == '') {
      alert("Write all fields");
      return;
    }
    // Validation of input
    let val = await deviceStorage.retrieveItem('access_token');
    fetch(GLOBALS.BASE_URL + '/zavhoz/insert.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + val.toString(),
      },
      body: 'init_cost=' + this.state.init_cost + '&name='
      + this.state.name + '&arom_price=' + this.state.arom_price
      + '&responsible=' + this.state.responsible + '&place='
      + this.state.place + '&date=' + this.state.date
      + '&month_expired=' + this.state.month_expired,
    })
    .then(response => response.json())
    .then(res => {
        if (res.error === "no error") {
            alert("Operation successful. And id is " + res.id);
            this.setState({
              init_cost : '',
              arom_price : '',
              responsible : '',
              place : '',
              date : '',
              name : '',
              month_expired : '',
            });
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
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
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
  }
});
