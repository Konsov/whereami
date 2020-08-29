import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Alert,
  BackHandler,
  AppState, KeyboardAvoidingView
} from 'react-native';

import AwesomeAlert from 'react-native-awesome-alerts';

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
    password: '',
    showAlert: false
  }

  showAlert = (alert) => {
    this.setState({
      showAlert: true,
      error_text: alert
    });
  };
  
  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('AuthStack');
    });
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  
  loginUser = (email, password) => {
    try {
      firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
        // Handle Errors here.
        var errorMessage = error.message;
        
        this.showAlert(errorMessage)
        // ...
      });
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
       
          <KeyboardAvoidingView style= {styles.containerItems} behavior="heoght">
            <Item floatingLabel>
              <Label style = {{color: "#FFFFFF"}}>Email</Label>
              <Input
                id = "email"
                autoCorrect={false}
                autoCapitalize="none"
                style={{color:'white', fontWeight:'bold'}}
                underlineColorAndroid = "white"
                onChangeText={(email) => this.setState({ email })} />
            </Item>

            <Item floatingLabel style={styles.item}>
              <Label style = {{color: "#FFFFFF"}}>Password</Label>
              <Input
                id="password"
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                underlineColorAndroid = "white"
                style={{color:'white', fontWeight:'bold'}}
                onChangeText={(password) => this.setState({ password })}
              />
            </Item>
          </KeyboardAvoidingView>
          
          <View style={styles.containerButtons}>
            <AwesomeButton
              id="buttonLogin"
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
      <AwesomeAlert
            show= {this.state.showAlert}
            title="Error"
            message={this.state.error_text}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            alertContainerStyle={styles.alert}
            confirmButtonColor="#DD6B55"
            confirmText="DISMISS"
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />
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
  alert: {
    zIndex: 10
  },
  containerButtons:{
    alignSelf: 'center',
    width: windowWidth/2,
    marginTop:windowHeight/20,
  },
  button:{
    marginTop: windowHeight/50,
    elevation:0
  },
  item:{
    marginTop: windowHeight/50
  },
  containerItems:{
    borderColor:'#0F52BA',
    borderWidth: 3,
    borderRadius:20,
    paddingTop: windowHeight/15,
    paddingBottom: windowHeight/15,
    paddingHorizontal: windowWidth/20,
    backgroundColor:  '#0F52BA99',
  }

});