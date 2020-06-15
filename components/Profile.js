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
    id : '1',
    data : {
      first : {
        title: 'INSPECT',
        go: "Scanner",
      },
      second : {
        title: 'ADD',
        go: "InsertThing",
      },
    }
  },
  {
    id : '2',
    data : {
      first : {
        title: 'ADD RESPONSIBLE',
        go: "InsertResponsible",
      },
      second : {
        title: 'THE ROOMS',
        go: 'GetPlace',
      }
    }
  },
  {
    id : '3',
    data : {
      first : {
        title: 'STAFF',
        go: 'GetStaff',
      },
      second : {
        title: 'REVISION',
        go: 'Revision',
      }
    }
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop : 50,
    backgroundColor: 'white',
  },
  text: {
    flex : 1,
    fontFamily : 'Electrolize',
    color : 'white',
    fontSize : 20,
    textAlign : 'center',
    textAlignVertical: 'center',
  },
  items : {
    width  : 30,
  },
  btn : {
    height : 150,
    width : 150,
    alignItems : 'center',
    backgroundColor: '#74B43F',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  contentContainer : {
    flex : 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  }
});

const Item = ({data, navigation}) => {
  return (
    <View
    style = {{
      justifyContent:'space-around',
      flexDirection : 'row'
    }}
    >
    <TouchableOpacity
      style = {styles.btn}
      onPress = {() => navigation.navigate(data.first.go)}
    >
    <Text
      style={styles.text}
    >{data.first.title}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style = {styles.btn}
      onPress = {() => navigation.navigate(data.second.go)}
    >
    <Text
      style={styles.text}
    >{data.second.title}</Text>
    </TouchableOpacity>
    </View>
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
              data={item.data}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
