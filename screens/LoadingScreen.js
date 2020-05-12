import React, { Component } from 'react';
import {
  View,
  Image,
  AsyncStorage
} from 'react-native';

import firebase from '../services/firebase'


class LoadingScreen extends Component {

  constructor(props) {
    super(props)
    this.state = ({
      registerToken: '',
      notif:'',
      volume:true
      })

  }

  componentDidMount() {

    setTimeout(() => {try {
      
      firebase.auth().onAuthStateChanged((user) => {
        
        if(user){
          this.isOnline()
        }
        
        this.navigate(user ? 'HomeScreen' : 'AuthStack')

      });
    } catch (error) {
      console.log(error.toString())
    }}, 7000)

    
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
  
  }

  navigate(data) {
    AsyncStorage.getItem('volume').then(value =>
      //AsyncStorage returns a promise so adding a callback to get the value
      this.props.navigation.navigate(data, {volume: value})
      //Setting the value in Text
    );
    
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
        <Image source={require('../files/nuv2.gif')} style={{width: "100%", height: '100%' }}/>        
      </View>
    );
  }
} export default LoadingScreen;