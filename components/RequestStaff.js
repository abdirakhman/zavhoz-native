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
import * as Font from 'expo-font';
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
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Request', { id: go.toString() })}
    >
    <Text style={styles.text}>{title.toString()}</Text>
    </TouchableOpacity>
  );
}


export default class RequestStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: '',
      data : [],
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    let val = await deviceStorage.retrieveItem('access_token');
    const { navigation } = this.props;
    let kek = navigation.getParam('id', '0');
    return fetch(
      GLOBALS.BASE_URL + '/zavhoz/getThingsByResponsible.php',
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
            data : responseJson.return_array,
          },
          function() {}
        );
        this.initialData = responseJson.return_array;
      })
      .done();
  }

  _searchFilterFunction = text => {
    if (!text || text === '') {
      this.setState({data : this.initialData});
      return;
    }
    const newData = this.initialData.filter(item => {
      const itemData = `${item.name.toString().toUpperCase()}`;

       const textData = text.toString().toUpperCase();

       return itemData.indexOf(textData) > -1;
    });
    this.setState({ data: newData });
  };


  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#74B43F"/>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <TextInput
          placeholder="Thing"
          autoCapitalize="none"
          onChangeText={text => this._searchFilterFunction(text)}
          style={styles.textInput}
        />
        <FlatList
          data={this.state.data}
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
