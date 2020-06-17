//todo normanlniy navigate s scannera
//normalniy check
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './components/Login';
import Profile from './components/Profile';
import GetStaff from './components/GetStaff';
import GetPlace from './components/GetPlace';
import InsertResponsible from './components/InsertResponsible';
import Revision from './components/Revision';
import Request from './components/Request';
import InsertThing from './components/InsertThing';
import InsertPlace from './components/InsertPlace';
import RequestStaff from './components/RequestStaff';
import RequestPlace from './components/RequestPlace';
import Scanner from './components/Scanner';
import Check from './components/Check';



const MainNavigator = createStackNavigator({
  Home: {screen: Login},
  Profile: {screen: Profile},
  GetStaff: {screen : GetStaff},
  GetPlace : {screen : GetPlace},
  InsertResponsible : {screen : InsertResponsible},
  InsertThing : {screen : InsertThing},
  InsertPlace : {screen: InsertPlace},
  Revision : {screen : Revision},
  Request : {screen : Request},
  RequestStaff : {screen : RequestStaff},
  RequestPlace : {screen : RequestPlace},
  Scanner : {screen : Scanner},
  Check : {screen : Check},
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const App = createAppContainer(MainNavigator);

export default App;
