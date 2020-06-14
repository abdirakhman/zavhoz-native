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
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Button,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

const DATA = [
  {
    id: '1',
    title: 'INSPECT',
    go: "Scanner",
    style: {
      alignSelf : 'flex-start',
    }
  },
  {
    id: '2',
    title: 'ADD',
    go: "InsertThing",
    style : {
      alignSelf: 'flex-end'
    }
  },
  {
    id: '3',
    title: 'ADD RESPONSIBLE',
    go: "InsertResponsible",
    style: {
      alignSelf : 'flex-start',
    }
  },
  {
    id: '4',
    title: 'THE ROOMS',
    go: 'GetPlace',
    style : {
      alignSelf: 'flex-end'
    }
  },
  {
    id: '5',
    title: 'STAFF',
    go: 'GetStaff',
    style: {
      alignSelf : 'flex-start',
    }
  },
  {
    id: '6',
    title: 'REVISION',
    go: 'Revision',
    style : {
      alignSelf: 'flex-end'
    }
  },
];

const Item = ({title, go, navigation, customStyle}) => {
  return (
    <TouchableOpacity
        style={[styles.btn, customStyle]}
        onPress={() => navigation.navigate(go.toString())}
    >
      <Text
      style={styles.text}
      >
      {title.toString()}
      </Text>
    </TouchableOpacity>
  );
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsLoaded: false,
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    this.setState({ assetsLoaded: true });
  }
  render() {
    if (!this.state.assetsLoaded) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#00B3FF"/>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={DATA}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              go={item.go}
              customStyle={item.style}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop : 50,
    backgroundColor: 'white',
  },
  text: {
    color: '#00B3FF',
    fontFamily: 'Electrolize',
    fontSize: 20,
    textAlign: 'center',
  },
  items : {
    width  : 30,
  },
  btn : {
    borderWidth: 1,
    borderColor: '#00B3FF',
    //paddingLeft: 50,
    //paddingRight: 50,
    padding: 5,
    marginLeft: 30,
    marginRight: 30,
  },
  contentContainer : {
    flex : 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  }
});
