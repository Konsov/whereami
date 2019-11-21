import React, { Component } from 'react';

import LoginMethodScreen from '../screens/LoginMethodScreen'
import EmailSignInScreen from '../screens/EmailSignInScreen'
import EmailSignOutScreen from '../screens/EmailSignOutScreen'
import LoadingScreen from '../screens/LoadingScreen'
import HomeScreen from '../screens/HomeScreen'


import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


const AuthStack = createStackNavigator(
  {
  LoginMethodScreen:  {screen: LoginMethodScreen},
  EmailSignInScreen:  {screen: EmailSignInScreen},
  EmailSignOutScreen: {screen: EmailSignInScreen}
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