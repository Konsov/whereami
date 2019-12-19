import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import firebase from '../services/firebase'
import NotifService from '../services/NotifService';


class LoadingScreen extends Component {

  constructor(props) {
    super(props)
    this.state = ({
      registerToken: ''
      })

  }

  onRegister(token) {
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
  }

  componentDidMount() {
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  componentDidUpdate() {
    try {
      var k = this.state.registerToken;
     
      const user = firebase.auth().currentUser;
      firebase.auth().onAuthStateChanged((user) => {
        
        if (user) {
          firebase.database().ref(`users/${user.uid}/token`).once('value').then(function (snapshot) {
            if (snapshot == undefined){
              firebase.database().ref(`users/${user.uid}`).set({
                token : k
              })
            } else if (snapshot.val() != k){
              firebase.database().ref(`users/${user.uid}`).update({
                token : k
              })
            }
          })
          
        }

        this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');

      });
    } catch (error) {
      console.log(error.toString())
    }
  }



  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
} export default LoadingScreen;