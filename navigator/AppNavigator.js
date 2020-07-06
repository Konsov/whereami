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
import LeaderScreen from '../screens/LeaderScreen'
import NotifService from '../services/NotifService'
import PlayerProfileScreen from '../screens/PlayerProfileScreen'
import UsernameAddScreen from '../screens/UsernameAddScreen'
import WelcomeScreen from '../screens/WelcomeScreen'


import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';


const AuthStack = createStackNavigator(
  {
  LoginMethodScreen:  {screen: LoginMethodScreen},
  EmailSignInScreen:  {screen: EmailSignInScreen},
  EmailSignUpScreen: {screen: EmailSignUpScreen},
  UsernameAddScreen: {screen: UsernameAddScreen}, 
  },{
    defaultNavigationOptions: {
      headerShown: false
    },
  }
);


const GameStack = createStackNavigator(
  {
    PlayScreen: {screen: PlayScreen},
    InsertMarker: {screen: InsertMarker}
  },{
    defaultNavigationOptions: {
      headerShown: false
    },
  }
);


const AppStack = createStackNavigator(
  {
  HomeScreen: {screen: HomeScreen},
  UserProfileScreen : {screen: UserProfileScreen},
  NotificationScreen : {screen: NotificationScreen},
  FriendScreen: {screen: FriendScreen},
  LeaderScreen: {screen:LeaderScreen},
  NotifService: {screen: NotifService},
  PlayerProfileScreen : {screen: PlayerProfileScreen},
  WelcomeScreen : {screen: WelcomeScreen}
  
  },{
    defaultNavigationOptions: {
      headerShown: false
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