import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import firebase from '../services/firebase'


const user = firebase.auth().currentUser;

class LoadingScreen extends Component {

  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
        this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');
        console.log(user)
      
    });
    
  }

  render() {
    return (
      <View style={{flex:1, alignItems:'center',justifyContent: 'center'}} >
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
} export default LoadingScreen;