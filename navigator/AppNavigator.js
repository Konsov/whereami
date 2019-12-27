import React, { Component } from 'react';

import LoginMethodScreen from '../screens/LoginMethodScreen'
import EmailSignInScreen from '../screens/EmailSignInScreen'
import EmailSignUpScreen from '../screens/EmailSignUpScreen'
import LoadingScreen from '../screens/LoadingScreen'
import HomeScreen from '../screens/HomeScreen'
import PlayScreen from '../screens/PlayScreen'
import InsertMarker from '../screens/InsertMarker'
import UserProfileScreen from '../screens/UserProfileScreen'
import NotificationScreen from '../screens/NotificationScreen'
import FriendScreen from '../screens/FriendScreen'


import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


const AuthStack = createStackNavigator(
  {
  LoginMethodScreen:  {screen: LoginMethodScreen},
  EmailSignInScreen:  {screen: EmailSignInScreen},
  EmailSignUpScreen: {screen: EmailSignUpScreen}
  },{
    defaultNavigationOptions: {
      header: null
    },
  }
);


const GameStack = createStackNavigator(
  {
    PlayScreen: {screen: PlayScreen},
    InsertMarker: {screen: InsertMarker}
  },{
    defaultNavigationOptions: {
      header: null
    },
  }
);


const AppStack = createStackNavigator(
  {
  HomeScreen: {screen: HomeScreen},
  UserProfileScreen : {screen: UserProfileScreen},
  NotificationScreen : {screen: NotificationScreen},
  FriendScreen: {screen: FriendScreen}
  
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
      GameStack: GameStack
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);

export default AppNavigator;