import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Button,
  StyleSheet,
} from 'react-native';
import firebase from '../services/firebase';
import { LoginManager } from "react-native-fbsdk";


export default class HomeScreen extends Component {

  logOut () {
    firebase.auth().signOut();
    this.props.navigation.navigate('AuthStack');
    LoginManager.logOut();
  }

  gioca(){
    this.props.navigation.navigate('PlayScreen')
  }

  giocaConAmici(){
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

          <Button
            title="Gioca"
            onPress={() => this.gioca()}
          />

          <Button
            title="Gioca con amici"
            onPress={() => this.giocaConAmici()}
          />

          <Button
            title="Log out"
            onPress={() => this.logOut()}
          />


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
