import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import firebase from '../services/firebase'



class LoadingScreen extends Component {

  componentDidMount() {
   
   try {

      const user = firebase.auth().currentUser;
      firebase.auth().onAuthStateChanged((user) => {
      this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');
          
      });
    } catch (error) {
      console.log(error.toString())
    }
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