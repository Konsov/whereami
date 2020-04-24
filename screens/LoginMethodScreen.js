import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Button,
  StyleSheet,
  Image
} from 'react-native';

import {
  Container,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';
const firebase = require('firebase');

import FBLoginButton from '../services/FBLoginButton';

export default class LoginMethodScreen extends Component {


  render() {
    return (
      <View>
      <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>

        <View style={styles.container}>
          <Button
            title="Email Login"
            onPress={() => {this.props.navigation.navigate('EmailSignInScreen')}}
          />       

          <FBLoginButton />
          
        </View>

        </View> 
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