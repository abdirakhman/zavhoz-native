import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  FlatList,
  Button,
} from 'react-native';
import deviceStorage from './deviceStorage';
import { StackNavigator } from 'react-navigation';
import GLOBALS from '../Globals';


export default class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, token: ' ' };
  }
  async componentDidMount() {
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
            isLoading: false,
            dataSource: responseJson,
          },
          function() {}
        );
      })
      .done();
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    console.log(this.state.dataSource);
    console.log(this.state.dataSource.name);
    return (
      <View style={{ flex: 1, paddingTop: 20, alignItems:'center' }}>
              <Text style={styles.box}>{this.state.dataSource.name.toString()}</Text>
              <Text style={styles.box}>{this.state.dataSource.init_cost}</Text>
              <Text style={styles.box}>{this.state.dataSource.arom_price}</Text>
              <Text style={styles.box}>{this.state.dataSource.responsible}</Text>
              <Text style={styles.box}>{this.state.dataSource.place} </Text>
              <Text style={styles.box}>{this.state.dataSource.date} </Text>
              <Text style={styles.box}>{this.state.dataSource.month_expired} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2896d3',
  },
  text: {
    color: '#fff',
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  box: {

  }
});
