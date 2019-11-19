import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground, 
  Button,
  StyleSheet,
} from 'react-native';


export default class HomeScreen extends Component {

  render(){
    return (
     <ImageBackground source={require('../files/hom.png')} style={{width: '100%', height: '100%'}}>
       
        <View style={styles.container}>
       
          <Button 
          title="Gioca"
          />

          <Button
          title="Gioca con amici"
          />
        </View>
        
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop:'80%',
    marginLeft: '28%',
  },
})
