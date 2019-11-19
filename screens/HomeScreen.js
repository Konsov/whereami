import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Button,
  StyleSheet,
} from 'react-native';
import firebase from '../services/firebase';


export default class HomeScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <ImageBackground source={require('../files/hom.png')} style={{ width: '100%', height: '100%' }}>

        <View style={styles.container}>

          <Button
            title="Gioca"
          />

          <Button
            title="Gioca con amici"
          />

          <Button
            title="Log out"
            onPress={() => firebase.auth().signOut()}
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
