import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,  
} from 'react-native';

import FirstScreen from './screens/FirstScreen'
import Signin from './screens/Signin'
import ProfileScreen from './screens/ProfileScreen'
import HomeScreen from './screens/HomeScreen'

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const AuthStack = createStackNavigator({
  FirstScreen: {screen: FirstScreen},
  Signin: {screen: Signin},
  ProfileScreen: {screen: ProfileScreen},
});

const AppStack = createStackNavigator({
  HomeScreen: {screen: HomeScreen},
})


const App = createAppContainer( 
createSwitchNavigator(
    {
      AuthStack: AuthStack,
      AppStack: AppStack,
    },
    {
      initialRouteName: 'AuthStack',
    }
  )
);

export default App;