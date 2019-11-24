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

import FBLoginButton from '../services/FBLoginButton';

export default class LoginMethodScreen extends Component {


  render() {
    return (
      <ImageBackground source={require('../files/firstbg.jpg')} style={{ width: '100%', height: '100%' }}>

        <View style={styles.container}>
          <Button
            title="Email Login"
            onPress={() => {this.props.navigation.navigate('EmailSignInScreen')}}
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