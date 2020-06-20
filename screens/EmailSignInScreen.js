import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Alert,
} from 'react-native';

import {
  Item,
  Label,
  Input
} from 'native-base';

import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

import firebase from '../services/firebase'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class EmailSignInScreen extends Component {
  
  state={
    email: '',
    password: ''
  }
  
  loginUser = (email, password) => {
    try {
      firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      Alert.alert(error.toString())
    }
  }

  render() {
    return (     
      <View>
        <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>
        <Image source={require('../files/logo.png')} style={{position:'absolute', marginTop: windowHeight / 15, alignSelf:'center'}}/>
         
        <View style={styles.container}>
       
          <View style= {styles.containerItems}>
            <Item floatingLabel>
              <Label style = {{color: "#FFFFFF"}}>Email</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                style={{color:'white', fontWeight:'bold'}}
                underlineColorAndroid = "white"
                onChangeText={(email) => this.setState({ email })} />
            </Item>

            <Item floatingLabel style={styles.item}>
              <Label style = {{color: "#FFFFFF"}}>Password</Label>
              <Input
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                underlineColorAndroid = "white"
                style={{color:'white', fontWeight:'bold'}}
                onChangeText={(password) => this.setState({ password })}
              />
            </Item>
          </View >
          <View style={styles.containerButtons}>
            <AwesomeButton
              type="secondary"
              stretch = {true}
              onPress={() => this.loginUser(this.state.email, this.state.password)}
              style= {styles.button}
              > Login
            </AwesomeButton>
            <AwesomeButton
              type="primary"
              stretch = {true}
              style={styles.button}
              onPress={() => { this.props.navigation.navigate('EmailSignUpScreen') }}
              > Not already register? Sign Up!
            </AwesomeButton>
          </View>
     </View>
  </View> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop:windowHeight/3.5,
    alignSelf: 'center',
    width:windowWidth/1.3,
  },
  containerButtons:{
    alignSelf: 'center',
    width: windowWidth/2,
    marginTop:windowHeight/20,
  },
  button:{
    marginTop: windowHeight/50
  },
  item:{
    marginTop: windowHeight/50
  },
  containerItems:{
    borderColor:'#0F52BA',
    borderWidth: 3,
    borderRadius:20,
    paddingTop: windowHeight/20,
    paddingBottom: windowHeight/15,
    paddingHorizontal: windowWidth/20,
    backgroundColor:  '#0F52BA99',
  }

});