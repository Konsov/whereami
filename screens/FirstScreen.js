import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Button,
  StyleSheet,
} from 'react-native';

import {
  Container,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';
const firebase = require('firebase'); 
import { LoginManager ,AccessToken } from "react-native-fbsdk";

import FBLoginButton from '../services/FBLoginButton';

export default class FirstScreen extends Component {
  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      this.fireBaseListener = firebase.auth().onAuthStateChanged(auth => {
        if (auth) {
          this.firebaseRef = firebase.database().ref('users')
          this.firebaseRef.child(auth.uid).on('value', snap => {
            const user = snap.val()
            if (user != null) {
              this.firebaseRef.child(auth.uid).off('value')
   
              this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');
   
            }
          })
   
   
        } else {
          this.setState({ showSpinner: false })
        }
      })
      

    });
  }

  onPressLogin(){
    this.setState({ showSpinner: true })
      LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => this._handleCallBack(result),
        function(error) {
          alert('Login fail with error: ' + error);
        }
      )
  }
  _handleCallBack(result){
    let _this = this
    if (result.isCancelled) {
      alert('Login cancelled');
    } else {   
  AccessToken.getCurrentAccessToken().then(
          (data) => {
          
            const token = data.accessToken
            fetch('https://graph.facebook.com/v2.8/me?fields=id,first_name,last_name,gender,birthday&access_token=' + token)
            .then((response) => response.json())
            .then((json) => {
          
              const imageSize = 120
              const facebookID = json.id
              const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`
             this.authenticate(data.accessToken)
              .then(function(result){
                const uid = result.user.uid               
                _this.createUser(uid,json,token,fbImage)
              })
 
 
            })
            .catch(function(err) {
            	  console.log(err);
            });
          }
        )
 
    }
  }
  
  authenticate = (token) => { 
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    let ret = firebase.auth().signInWithCredential(credential)
    return ret;
  }
  createUser = (uid,userData,token,dp) => {
    const defaults = {
      uid,
      token,
      dp
    }
    firebase.database().ref('users').child(uid).update({ ...userData, ...defaults })
   
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground source={require('../files/firstbg.jpg')} style={{ width: '100%', height: '100%' }}>

        <View style={styles.container}>
          <Button
            title="Email Login"
            onPress={() => navigate('Signin')}
          />

          <Button
            onPress={this.onPressLogin.bind(this)}
            title="Login with facebook"
            color="#841584"
            />
          <FBLoginButton />
          
        </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: '80%',
    marginLeft: '28%',
  },
});