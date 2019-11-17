import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,  
} from 'react-native';

class ProfileScreen extends Component {
  static navigationOptions = {
         header: null,
  };
  render(){
    return (
        <View>
            <Text> This is ProfileScreen </Text>
        </View> 
    );
  }
}export default ProfileScreen;