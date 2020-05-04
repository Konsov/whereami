import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native';


import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';



const { width, height } = Dimensions.get('window');

import FBLoginButton from '../services/FBLoginButton';

export default class LoginMethodScreen extends Component {


  render() {
    return (
      <View>
      <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>
      <Image source={require('../files/logo.png')} style={{position:'absolute', marginTop: height / 5, alignSelf:'center'}}/>
      <View style={styles.container}>
        <View style={styles.item}>
          <View style={styles.buttonContainer}>
           <AwesomeButtonRick
              onPress={() => {this.props.navigation.navigate('EmailSignInScreen')}}
              type="anchor"
              stretch = {true}
              style = {{marginBottom: 20}}
            >Email Login
            </AwesomeButtonRick>       

          <FBLoginButton navigation={this.props.navigation} />
          </View> 
        </View>
        </View>
        </View> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    marginTop: '80%',
    alignItems : 'center'
  },
  item:{
    flexDirection: 'column',
    alignSelf:"center",
  },
  
  buttonContainer: {
    flex:1,
    width: width / 2,
    marginLeft: (width / 2) - (width / 4),
    
  }
});