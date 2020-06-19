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
import * as Font from 'expo-font';
import { StackNavigator } from 'react-navigation';
import GLOBALS from '../Globals';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex : 1,
    color: '#74B43F',
    fontFamily : 'Electrolize',
    textAlign : 'center',
    textAlignVertical : 'center',
  },
  textInput : {
    marginBottom : 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor : 'white',
    borderWidth : 1,
    fontFamily: 'Electrolize',
    height : 45,
    marginHorizontal : 30,
    padding: 16,
  },
  item : {
    backgroundColor : '#EEFCE8',
    borderWidth : 3,
    height : 45,
    marginHorizontal : 30,
    alignSelf : 'stretch',
    marginBottom : 10,
    borderColor : '#74B43F',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
});


function Item({ title, go, navigation }) {
  console.log("At least did you be here!")
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Request', { id: go.toString() })}
    >
    <Text style={styles.text}>{title.toString()}</Text>
    </TouchableOpacity>
  );
}

function isForgot(id, used) {
      for (const item of used) {
        if (id === +item) {
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
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
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
            <Item
              title={item}
              go={item}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={({ id }, index) => id}
        />
      </View>
    );
  }
}
