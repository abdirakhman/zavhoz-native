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
  ActivityIndicator,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import deviceStorage from '../components/deviceStorage';
import GLOBALS from '../Globals';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      assetsLoaded: false,
    };
  }

  async componentDidMount() {
    const value = await this._loadInitialState(); // returns promise, await resolve
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    if (value !== null) {
      this.props.navigation.navigate('Profile');
    }
    this.setState({ assetsLoaded: true });
  }

  _loadInitialState = async () => {
    const value = await AsyncStorage.getItem('good_before');
    let currentTime = new Date().getTime() / 1000;
    if (value < currentTime) {
      let val = await deviceStorage.retrieveItem('refresh_token');
      fetch(GLOBALS.BASE_URL + '/zavhoz/refresh.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'token=' + val,
      })
      .then(response => response.json())
      .then(res => {
          if (res.success === 1) {
            deviceStorage.saveItem('access_token', res.access_token);
            deviceStorage.saveItem('refresh_token', res.refresh_token);
            deviceStorage.saveItem('good_before', res.good_before);
          }
      })
      .catch((err) => {
        alert(err);
      })
      .done();
      if (val !== await deviceStorage.retrieveItem('refresh_token')) {
        return null;
      }
      return true;
    } else {
      return value;
    }
  };

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
            <Text style={styles.header}>Authorization</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter e-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={username => this.setState({ username })}
              underlineColorAndroid="transparent"
            />

            <TextInput
              style={styles.textInput}
              placeholder="Enter password"
              secureTextEntry
              onChangeText={password => this.setState({ password })}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity style={styles.btn} onPress={this.login}>
              <Text style={styles.buttonText}>login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
}
  login = () => {
    fetch(GLOBALS.BASE_URL + '/zavhoz/login.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'login=' + this.state.username + '&pass=' + this.state.password,
    })
    .then(response => response.json())
    .then(res => {
        if (res.success === 1) {
          deviceStorage.saveItem('user', this.state.username);
          deviceStorage.saveItem('access_token', res.access_token);
          deviceStorage.saveItem('refresh_token', res.refresh_token);
          deviceStorage.saveItem('good_before', res.good_before);
        } else {
          alert(res.error);
        }
        return res.success;
      })
    .then((success) => {
        if (success === 1)
          this.props.navigation.navigate('Profile');
      })
    .catch((err) => {
      alert(err);
    })
    .done();
  };
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingLeft: 40,
    paddingRight: 40,
  },
  header: {
    fontSize: 24,
    marginBottom: 60,
    fontFamily: 'Electrolize',
    color: '#000000',
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 20,
    fontFamily: 'Electrolize',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bdbdcf',
  },
  btn: {
    backgroundColor: '#74B43F',
    padding: 5,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Electrolize',
    fontSize: 25,
  },
});
