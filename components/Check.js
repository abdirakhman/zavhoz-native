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


function Item({ title, go, navigation }) {
  return (
    <View style={styles.item}>
      <Button onPress={() => navigation.navigate('RequestStaff', {
          id : go.toString(), })} title={title.toString()} />
    </View>
  );
}

function isForgot(id, used) {
      for (const item of used) {
        if (id === +item.id) {
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
      forgotThings: [],
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    let val = await deviceStorage.retrieveItem('access_token');
    const { navigation } = this.props;
    const used = this.props.navigation.state.params.used ?? [];
    fetch(GLOBALS.BASE_URL + '/zavhoz/get_max_id.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + val.toString(),
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        for (let i = 1; i <= responseJson.id; i++) {
          if (isForgot(i, used)) {
            this.setState(prevState => ({
              forgotThings: [...prevState.forgotThings, i],
            }));
          }
        }
        this.setState(
          {
            isLoading: false,
          },
          function() {}
        );
      })
      .catch(error => console.log(error))
      .done();
  }
  render() {
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
            <Text>{item}</Text>
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
