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
  ActivityIndicator,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import deviceStorage from '../components/deviceStorage';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ' ',
      password: ' ',
    };
  }

  async componentDidMount() {
    const value = await this._loadInitialState(); // returns promise, await resolve

    if (value !== null) {
      this.props.navigation.navigate('Profile');
    }
  }

  _loadInitialState = async () => {
    const value = await AsyncStorage.getItem('good_before');
    let currentTime = new Date().getTime() / 1000;
    if (value < currentTime) {
      return null;
    } else {
      return value;
    }
  };

  render() {
      return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.wrapper}>
          <View style={styles.container}>
            <Text style={styles.header}>- LOGIN -</Text>
            <TextInput
              style={styles.textInput}
              placeholder="E-mail"
              autoCapitalize="none"
              onChangeText={username => this.setState({ username })}
              underlineColorAndroid="transparent"
            />

            <TextInput
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry
              onChangeText={password => this.setState({ password })}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity style={styles.btn} onPress={this.login}>
              <Text>Log in</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
  }

  login = () => {
    fetch('http://192.168.1.7/zavhoz/login.php', {
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
    backgroundColor: '#2896d3',
    paddingLeft: 40,
    paddingRight: 40,
  },
  header: {
    fontSize: 24,
    marginBottom: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  btn: {
    alignSelf: 'stretch',
    backgroundColor: '#01c853',
    padding: 20,
    alignItems: 'center',
  },
});
