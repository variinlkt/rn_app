import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Main from './src/indexPage';
import Search from './src/searchPage'
  
const App = StackNavigator({
    Main: {screen: Main},
    Search: {screen: Search},
},
{
  initialRouteName: 'Main',
});
AppRegistry.registerComponent('MyApp', () => App);