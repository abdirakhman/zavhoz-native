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

function Item({ title, go, navigation }) {
  return (
    <View style={styles.item}>
      <Button onPress={() => navigation.navigate('RequestStaff', {
          lol : go.toString(), })} title={title.toString()} />
    </View>
  );
}

function isForgot(id) {
      for (const item of this.state.used) {
        if (id == item.id) {
          return false;
        }
      }
      return true;
  }

export default class Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: ' ',
      used: [],
      forgotThings: [],
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    let val = await deviceStorage.retrieveItem('access_token');
    const { navigation } = this.props;
    const {route} = this;
    console.warn(navigation.getParam(used));
    const used = route.params.used ?? [];
    console.log(used);
    alert('Used is ${used}');
    fetch('http://192.168.1.7/zavhoz/get_max_id.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + val.toString(),
      },
    })
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
      .catch(error => console.log(error))
      .done();
    for (let i = 1; i <= this.state.dataSource.id; i++) {
      if (isForgot(i)) {
        this.setState(prevState => ({
          forgotThings: [...prevState.forgotThings, i],
        }));
      }
    }
  }
  render() {
    console.log("kekeke");
    console.log(JSON.stringify(this.state.forgotThings))
    if (this.state.isLoading === true) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <FlatList
          data={this.state.forgotThings}
          renderItem={({ item }) => (
            <Text>{item.id}</Text>
          )}
          keyExtractor={({ id }, index) => id}
        />
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
  box: {},
});
