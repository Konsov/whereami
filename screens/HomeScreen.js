import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  BackHandler,
  Alert
} from 'react-native';

import firebase from '../services/firebase';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";
import { LoginManager } from "react-native-fbsdk";


export default class HomeScreen extends Component {

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Confirm exit',
        'Do you want to quit the app?',
        [
          {text: 'CANCEL', style: 'cancel'},
          {text: 'OK', onPress: () => BackHandler.exitApp()},
        ],
        
      );
      return true;
    });
  }

  logOut() {
    firebase.auth().signOut();
    this.props.navigation.navigate('AuthStack');
    LoginManager.logOut();
  }

  gioca() {
    const user = firebase.auth().currentUser;
    firebase.database().ref('Games/').child(`${user.uid}`).set(
      {
        player1: {
          user: user.uid,
          score: 0
        },
        round: 0,
        finished: false
      }
    ).then(firebase.database().ref('Games/').child(`${user.uid}`).update(
      {
        round:1
      }
    ).then(this.props.navigation.navigate('GameStack')))  
  }

  giocaConAmici() {
    const user = firebase.auth().currentUser;
    firebase.database().ref('waitingRoom/' + user.uid).set(
      {
        user: user.uid
      }
    )
    this.props.navigation.navigate('GameStack')
  }

  render() {
    return (
      <ImageBackground source={require('../files/hom.png')} style={{ width: '100%', height: '100%' }}>
        

        <View style={styles.container}>
          <View style = {styles.buttonContainer}>
          <AwesomeButton
            type="primary"
            style={styles.button}            
            stretch = {true}
            onPress={() => this.gioca()}
          >Gioca</AwesomeButton>

          <AwesomeButton
            type="primary"
            style={styles.button}            
            stretch = {true}
            onPress={() => this.giocaConAmici()}
          >Gioca con Amici</AwesomeButton>

          <AwesomeButton
            type="primary"
            style={styles.button}           
            stretch = {true}
            onPress={() => this.props.navigation.navigate('UserProfileScreen')}
          >Profile</AwesomeButton>


          <AwesomeButton
            type="primary"
            style={styles.button}            
            stretch = {true}
            onPress={() => this.logOut()}
          >Log Out</AwesomeButton>
        </View>


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

  button: {
    position: 'relative',
    marginTop:10,
  },

  buttonContainer : {
    width:150,
    alignSelf: "center",
    marginTop: -100  }
})
