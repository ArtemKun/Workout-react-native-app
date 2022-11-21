import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute  } from "@react-navigation/native"

import HomeScreen from './screens/Home';
import AddScreen from './screens/Add';
import MainScreen from './screens/Main';
import HomeStats from './screens/HomeStats';
import StatsScreen from './screens/Stats';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function StackScreen1() {
  return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{tabBarShowLabel:false, headerShown:false, animation:'fade_from_bottom'}} >
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
  );
}
function StackScreen2() {
  return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{tabBarShowLabel:false, headerShown:false, animation:'fade_from_bottom'}} >
        <Stack.Screen name="HomeStats" component={HomeStats}/>
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
  );
}
export default function App({route}) {

  return (
    <NavigationContainer >
      <Tab.Navigator  initialRouteName="MyHome" screenOptions={{tabBarHideOnKeyboard:"true", tabBarActiveTintColor: 'black', tabBarShowLabel:false, headerShown:false, }} >
        <Tab.Screen name="MyHome" component={StackScreen1} options={({ route }) => ({ tabBarStyle: ((route) => {const routeName = getFocusedRouteNameFromRoute(route) ?? ""; if (routeName === 'Main' || routeName === "Add") { return { display: "none" } }; return })(route),tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={40} />)})}/>
        <Tab.Screen name="MyStats" component={StackScreen2}options={({ route }) => ({ tabBarStyle: ((route) => {const routeName = getFocusedRouteNameFromRoute(route) ?? ""; if (routeName === 'Stats') { return { display: "none" } }; return })(route),tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bar-chart" color={color} size={34} />)})}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
