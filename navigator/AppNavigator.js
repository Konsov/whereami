import React, { Component } from 'react';

import FirstScreen from '../screens/FirstScreen'
import Signin from '../screens/Signin'
import LoadingScreen from '../screens/LoadingScreen'
import HomeScreen from '../screens/HomeScreen'

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


const AuthStack = createStackNavigator(
  {
  FirstScreen: {screen: FirstScreen},
  Signin: {screen: Signin},
  },{
    defaultNavigationOptions: {
      header: null
    },
  }
);

const AppStack = createStackNavigator(
  {
  HomeScreen: {screen: HomeScreen},
  },{
    defaultNavigationOptions: {
      header: null
    },
  }
);


const AppNavigator = createAppContainer( 
createSwitchNavigator(
    {
      AuthLoading: LoadingScreen,
      AuthStack: AuthStack,
      AppStack: AppStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);

export default AppNavigator;