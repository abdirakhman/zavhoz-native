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
    color: '#74B43F',
    fontFamily : 'Electrolize',
    textAlign : 'center',
  },
  title : {
    alignItems : 'center',
    justifyContent : 'center',
    marginBottom : 10,
    fontFamily: 'Electrolize',
    height : 45,
    marginHorizontal : 30,
    padding: 16,
  },
  titleText : {
    fontFamily: 'Electrolize',
    fontSize : 15,
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
    justifyContent : 'center',
    alignItems : 'center',
    marginBottom : 10,
    borderColor : '#74B43F',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
});


function Item({ title, go, navigation }) {
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

  function CreateTitle({navigation}) {
    return (
      <View style={styles.title}>
      <Text style={styles.titleText}>
      {'Revising things by ' + navigation.state.params.type + ' : ' + navigation.state.params.id.name}
      </Text>
      </View>
    );
  }

  function CreateTitleAll({navigation}) {
    return (
      <View style={styles.title}>
      <Text style={styles.titleText}>
      {'Revising all things'}
      </Text>
      </View>
    );
  }

export default class Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: '',
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
    const used = navigation.state.params.used ?? [];
    let req = "";
    if (navigation.state.params.type == "responsible") {
      req = "responsible=" + navigation.state.params.id.id;
    } else if (navigation.state.params.type == "place") {
      req = "place=" + navigation.state.params.id.id;
    }
    fetch(GLOBALS.BASE_URL + '/zavhoz/get_id.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + val.toString(),
      },
      body: req,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error != "no error") {
          alert(responseJson.error);
          return;
        }
        let arr = responseJson.return_array;
        for (let i = 0; i < arr.length; i++) {
          if (isForgot(arr[i].id, used)) {
            this.setState(prevState => ({
              forgotThings: [...prevState.forgotThings, arr[i]],
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
        {this.props.navigation.state.params.type == "responsible" && (<CreateTitle navigation={this.props.navigation}/>)}
        {this.props.navigation.state.params.type == "place" && (<CreateTitle navigation={this.props.navigation}/>)}
        {this.props.navigation.state.params.type == "all" && (<CreateTitleAll/>)}
        <FlatList
          data={this.state.forgotThings}
          renderItem={({ item }) => (
            <Item
              title={item.name}
              go={item.id}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={({ id }, index) => id}
        />
      </View>
    );
  }
}
