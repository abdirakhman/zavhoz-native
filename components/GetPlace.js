import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  SafeAreaView,
  FlatList,
  Button,
  ActivityIndicator,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import * as Font from 'expo-font';
import deviceStorage from '../components/deviceStorage';
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
      onPress={() => navigation.navigate('RequestPlace', {
          id : go.toString(), })}
    >
    <Text style={styles.text}>{title.toString()}</Text>
    </TouchableOpacity>
  );
}


export default class GetPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: ' ',
    };
  }
  async componentDidMount() {
    let val = await deviceStorage.retrieveItem("access_token");
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    return fetch(GLOBALS.BASE_URL + '/zavhoz/get_place.php', {
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
            dataSource: responseJson.return_array,
          },
          function() {}
        );
      })
      .done();
  }

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
        <FlatList
          data={this.state.dataSource}
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
