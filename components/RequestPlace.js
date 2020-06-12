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
      <Button
        onPress={() => navigation.navigate('Request', { lol: go.toString() })}
        title={title.toString()}
      />
    </View>
  );
}

export default class RequestPlace extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, token: ' ' };
  }
  async componentDidMount() {
    let val = await deviceStorage.retrieveItem('access_token');
    const { navigation } = this.props;
    let kek = navigation.getParam('lol', '0');
    //alert('Authorization' + ' Bearer ' + AsyncStorage.getItem('access_token'));
    return fetch(
      'http://192.168.1.3/zavhoz/getThingsByPlace.php',
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
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
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
});
