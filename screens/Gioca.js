import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
const firebase = require('firebase');
import functions from 'firebase-functions';




export default class Gioca extends Component {
    
    componentDidMount(){
        functions.database.ref('waitingRoom').onCreate((snapshot,context) => {
            const original = snapshot.val();
            console.log('Uppercasing', context.params, original);
        })
    }

    render() {
      return (
        <ImageBackground source={require('../files/hom.png')} style={{ width: '100%', height: '100%' }}>
  
          <View style={styles.container}>
  
  
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
  })