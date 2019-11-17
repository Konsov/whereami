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

export default class FirstScreen extends Component {
  static navigationOptions = {
         header: null,
  };
  render(){
    const {navigate} = this.props.navigation;
    return (
      <ImageBackground source={require('../files/firstbg.jpg')} style={{width: '100%', height: '100%'}}>
       
        <View style={styles.container}>
          <Button 
          title="Email Login"
          onPress={() => navigate('Signin')}
          />

          <Button
          title="Facebook Login"
          onPress={() => navigate('ProfileScreen')}
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
});