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
  Button
 } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class InsertResponsible extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
        <View style={styles.container}>
          <TextInput style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}/>
          <TextInput style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}/>
          <TextInput style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}/>
          <TextInput style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}/>
          <TextInput style={{ width : 80, height: 40, borderColor: 'gray', borderWidth: 1 }}/>
        </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2896d3'
  },
  text : {
    color: '#fff'
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
});
