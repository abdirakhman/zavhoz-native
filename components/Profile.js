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
} from 'react-native';
import { StackNavigator } from 'react-navigation';

const DATA = [
  {
    id: '1',
    title: 'Check thing',
    go: "Scanner",
  },
  {
    id: '2',
    title: 'Insert thing',
    go: "InsertThing",
  },
  {
    id: '3',
    title: 'Insert responsible',
    go: "InsertResponsible",
  },
  {
    id: '4',
    title: 'Get all places',
    go: 'GetPlace',
  },
  {
    id: '5',
    title: 'Get all staff',
    go: 'GetStaff',
  },
  {
    id: '6',
    title: 'Revision',
    go: 'Revision',
  },
];

function Item({ title, go, navigation }) {
  return (
    <View style={styles.item}>
      <Button onPress={() => navigation.navigate(go.toString())} title={title.toString()} />
    </View>
  );
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.data}
          data={DATA}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              go={item.go}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
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
  data : {
    marginTop : 50,
  }
});
