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
        params : {type : 'Request'}
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
        go: 'AskRevision',
      }
    }
  },
  {
    id : '4',
    data : {
      first : {
        title: 'ADD PLACE',
        go: 'InsertPlace',
      },
      second : {
        title: "EDIT",
        go: "Scanner",
        params : {type : 'Edit'}
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
    fontFamily : 'Electrolize',
    color : 'white',
    fontSize : 20,
    textAlign : 'center',
  },
  items : {
    width  : 30,
  },
  btn : {
    display : 'flex',
    height : 125,
    width : 125,
    justifyContent : 'center',
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
      onPress = {() => navigation.navigate(data.first.go, (data.first.params ? data.first.params : {}))}
    >
    <Text
      style={styles.text}
    >{data.first.title}</Text>
    </TouchableOpacity>
    {data.second &&
    (<TouchableOpacity
      style = {styles.btn}
      onPress = {() => navigation.navigate(data.second.go, (data.second.params ? data.second.params : {}))}
    >
    <Text
      style={styles.text}
    >{data.second.title}</Text>
    </TouchableOpacity>)
    }
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
          <ActivityIndicator size="large" color="#74B43F"/>
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
