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
  Dimensions
} from 'react-native';
import deviceStorage from './deviceStorage';
import * as Font from 'expo-font';
import { StackNavigator } from 'react-navigation';
import GLOBALS from '../Globals';


function getMin(a,  b){
  if(a < b) return a;
  else return b;
}

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var boxHeight = getMin(deviceHeight * 4/5, 500);

export default class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, token: ' ' };
  }
  async componentDidMount() {
    let val = await deviceStorage.retrieveItem('access_token');
    const { navigation } = this.props;
    let kek = navigation.getParam('id', '0');
    return fetch(
      GLOBALS.BASE_URL + '/zavhoz/request.php',
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
            dataSource: responseJson,
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
        <Text style={styles.title}> Item Information </Text>
        <View style={{borderWidth: 3, height: getMin(deviceHeight * 4/5, 500), width: (deviceWidth * 9/10), borderColor: '#74B43F'}}>
                <View style={styles.whiteBox}>
                  <Text style={styles.textStyle}>{"Name: " + this.state.dataSource.name.toString()}</Text>
                  <Button title={"Update"}/>
                </View>
                <View style={styles.greenBox}>
                  <Text style={styles.textStyle}>{"Initial Cost: " + this.state.dataSource.init_cost}</Text>
                </View>
                <View style={styles.whiteBox}>
                 <Text style={styles.textStyle}t>{"Amoratized Cost: " + this.state.dataSource.arom_price}</Text>
                </View>
                <View numberOfLines={2} style={styles.greenBox}>
                  <Text style={styles.textStyle}>{"Responsible: " + this.state.dataSource.responsible}</Text>
                </View>
                <View style={styles.whiteBox}>
                  <Text style={styles.textStyle}>{"Room: " + this.state.dataSource.place}</Text>
                </View>
                <View style={styles.greenBox}>
                  <Text style={styles.textStyle}>{"Date: " + this.state.dataSource.date}</Text>
                </View>
                <View style={styles.whiteBox}>
                  <Text style={styles.textStyle}>{"The Expiration: " + this.state.dataSource.month_expired}</Text>
                </View>
        </View>
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
  title : {
    fontSize:36,
    paddingBottom: 36,
    fontFamily : 'Electrolize',
  },
  box: {
    borderWidth: 3,
    height: boxHeight,
    width: (deviceWidth * 9/10),
    borderColor: '#74B43F',
    alignItems: 'center'
  },
  whiteBox: {
    flex: 1,
    backgroundColor: 'white',
  },
  greenBox: {
    flex: 1,
    backgroundColor: '#EEFCE8',
  },
  textStyle: {
    fontSize: 22,
    justifyContent: 'center',
    marginLeft: 10,
    color: '#74B43F',
    paddingTop:1,
    flex: 1,
    fontFamily : 'Electrolize',
  },
});
