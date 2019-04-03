
import { createStackNavigator, createAppContainer } from "react-navigation"; 
import IndexPage from './src/indexPage'
import SearchPage from './src/searchPage'
const AppNavigator = createStackNavigator(
  {
    Home: IndexPage,
    Search: SearchPage
  },
  {
    initialRouteName: "Home"
  }
); 
export default createAppContainer(AppNavigator);