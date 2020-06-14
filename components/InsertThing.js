//https://www.npmjs.com/package/react-native-datepicker
import React from 'react';
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
      date : '2015-01-01',
      name : '',
      month_expired : '',
    };
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
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.wrapper}>
        <View style={styles.container}>
          <TextInput
          keyboardType="number-pad"
          style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={this._handleNumber('init_cost')}
          value={this.state.init_cost}
          />
          <TextInput
          keyboardType="number-pad"
          style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={this._handleNumber('arom_price')}
          value={this.state.arom_price}
          />
          <TextInput
          keyboardType="number-pad"
          style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={this._handleNumber('responsible')}
          value={this.state.responsible}
          />
          <TextInput
          keyboardType="number-pad"
          style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={this._handleNumber('place')}
          value={this.state.place}
          />
          <DatePicker
            style={{width: 200}}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2000-01-01"
            showIcon={false}
            maxDate="2050-01-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={(date) => {this.setState({date: date})}}
          />
          <TextInput
          style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={this.state.name}
          onChangeText={this._handleText('name')}
          />
          <TextInput
          keyboardType="number-pad" style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={this._handleNumber('month_expired')}
          value={this.state.month_expired}
          />
          <TouchableOpacity style={styles.btn} onPress={this._handleinsert}>
            <Text style={styles.buttonText}>Insert</Text>
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
              date : '2015-01-01',
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
  wrapper: {
    flex: 1,
  },
  container: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2896d3'
  },
  text : {
    color: '#fff'
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
});
