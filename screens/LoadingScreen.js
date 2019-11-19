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

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');
        console.log('user logged')
      }
    });
    console.log("sadasdasd");
    console.log(user);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = () => {
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
} export default LoadingScreen;