import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native';


import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


import FBLoginButton from '../services/FBLoginButton';

export default class LoginMethodScreen extends Component {


  render() {
    return (
      <View>
        <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>
        <Image source={require('../files/logo.png')} style={{position:'absolute', marginTop: windowHeight / 15, alignSelf:'center'}}/>
         
          <View style={styles.buttonContainer}>

            <AwesomeButtonRick style={styles.button}
                onPress={() => {this.props.navigation.navigate('EmailSignInScreen')}}
                type="secondary"
                stretch = {true}
                id="Login"
            >Email Login
            </AwesomeButtonRick>       

            <FBLoginButton />
          
          </View>
      </View> 
    );
  }
}

const styles = StyleSheet.create({

  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: windowWidth/2,
    marginTop:windowHeight/2
  },
  button:{
    marginBottom: windowHeight/50
  },
});