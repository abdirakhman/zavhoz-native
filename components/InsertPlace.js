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

export default class InsertPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '',
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
          <Text style={styles.title}>Adding the place</Text>
          <TextInput
          placeholder="Name of Place"
          style={styles.textInput}
          value={this.state.name}
          onChangeText={this._handleText('name')}
          />
          <TouchableOpacity style={styles.btn} onPress={this._handleinsert}>
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  _handleinsert = async () => {
    if (this.state.name == '') {
      alert("Write all fields");
      return;
    }
    // Validation of input
    let val = await deviceStorage.retrieveItem('access_token');
    fetch(GLOBALS.BASE_URL + '/zavhoz/insertPlace.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + val.toString(),
      },
      body: 'name=' + this.state.name,
    })
    .then(response => response.json())
    .then(res => {
        if (res.error === "no error") {
            alert("Operation successful. And id is " + res.id);
            this.setState({
              name : '',
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