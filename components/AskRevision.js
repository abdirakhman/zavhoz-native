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
    paddingTop: 20,
    justifyContent: 'center'
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
  title : {
    textAlign : 'center',
    marginBottom : 20,
    fontFamily : 'Electrolize',
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
  contentContainer : {
    flex : 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  }
});


function Item({ title, go, navigation }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation.state.params.callback(go, title);
        navigation.goBack();
      }}
    >
    <Text style={styles.text}>{title.toString()}</Text>
    </TouchableOpacity>
  );
}


export default class AskRevision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: '',
      data : [],
      responsible : {},
      place : {},
     };
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Electrolize': require('../assets/fonts/Electrolize.otf'),
    });
    this.setState({isLoading : false});
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.responsible !== this.state.responsible) {
      this.props.navigation.navigate('Revision', {type : "responsible", id : this.state.responsible});
    }
    if (prevState.place !== this.state.place) {
      this.props.navigation.navigate('Revision', {type : "place", id : this.state.place});
    }
  }

  _returnDataResponsible = (_id, _name) => {
    this.setState(prevState => ({
      responsible: {
        ...prevState.responsible,
        name: _name,
        id : _id,
      }
    }));
  }
  _returnDataPlace = (_id, _name) => {
    this.setState(prevState => ({
      place: {
        ...prevState.place,
        name: _name,
        id : _id,
      }
    }));
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
      <View style={styles.container}>
        <Text style={styles.title}>
        {'Choose what you want to do'}
        </Text>
        <View>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
                this.props.navigation.navigate('SelectResponsible', {callback : this._returnDataResponsible});
            }}
          >
            <Text style={styles.text}>
            {'By Responsible'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.item}
          onPress={() => {
            this.props.navigation.navigate('SelectPlace', {callback : this._returnDataPlace});
          }}
          >
            <Text style={styles.text}>
            {'By Place'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.item}
          onPress={() => {this.props.navigation.navigate('Revision', {type : "all", id : -1});}}
          >
            <Text style={styles.text}>
            {'All'}
            </Text>
          </TouchableOpacity>


        </View>
      </View>
    );
  }
}
