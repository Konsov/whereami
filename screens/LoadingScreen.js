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
      registerToken: '',
      notif:false
      })

  }

  onRegister(token) {
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    this.setState({
      notif: true
    })
  }

  componentDidMount() {
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  isOnline(){
    firebase.database().ref('.info/connected').on('value', function(snapshot) {
      
      if (snapshot.val() == false) {
          return;
      };
      
      var uid = firebase.auth().currentUser.uid;

      var userStatusDatabaseRef = firebase.database().ref('/users/' + uid);  
      
      userStatusDatabaseRef.onDisconnect().update({online: false}).then(function() {
          // The promise returned from .onDisconnect().set() will
          // resolve as soon as the server acknowledges the onDisconnect() 
          // request, NOT once we've actually disconnected:
          // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
          
          // We can now safely set ourselves as 'online' knowing that the
          // server will mark us as offline once we lose connection.
          userStatusDatabaseRef.update({online: true});
      });
  });
  }

  componentDidUpdate() {
    try {
      var k = this.state.registerToken;
     
      this.isOnline();
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
        if (this.state.notif){
          this.props.navigation.navigate("NotificationScreen");

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