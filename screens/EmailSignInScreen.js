import React, { Component } from 'react';
import {

  StyleSheet,
  
  KeyboardAvoidingView,
  View,
  Image,
  Dimensions,
} from 'react-native';

import {
  Item,
  Label,
  Input
} from 'native-base';

import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

import firebase from '../services/firebase'


const { width, height } = Dimensions.get('window');

export default class EmailSignInScreen extends Component {

  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: ''
    })
  }

  loginUser = (email, password) => {
    try {
      firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      console.log(error.toString())
    }
  }

  render() {
    return (     
      <View>
        <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>
        <Image source={require('../files/logo.png')} style={{position:'absolute', marginTop: height / 5, alignSelf:'center'}}/>
        <View style={styles.container}>
        <KeyboardAvoidingView behavior='height'>
          <View style={styles.item}>
            <View style ={{backgroundColor:'rgba(152, 203, 228, 0.5)'}}>
              <Item  floatingLabel style= {styles.input}>
                <Label style = {{color: "#FFFFFF"}}>Email</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={{color:'white', fontWeight:'bold', fontSize:20}}
                  underlineColorAndroid = "white"
                  onChangeText={(email) => this.setState({ email })} />
              </Item>

              <Item floatingLabel style= {styles.input}>
                <Label style = {{color: "#FFFFFF"}}>Password</Label>
                <Input
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  underlineColorAndroid = "white"
                  style={{color:'white', fontWeight:'bold', fontSize:20}}
                  onChangeText={(password) => this.setState({ password })}
                />
              </Item>
            </View>
            <View style={styles.buttonContainer}>
              <AwesomeButton
                type="anchor"
                stretch = {true}
                style={styles.button}
                onPress={() => this.loginUser(this.state.email, this.state.password)}
              > Login
                </AwesomeButton>
              <AwesomeButton
                type="anchor"
                backgroundColor = "#CEFB80"
                borderColor= "#ADF888"
                stretch = {true}
                style={styles.button}
                onPress={() => { this.props.navigation.navigate('EmailSignUpScreen') }}
              > Not all ready register? Sign Up!
                </AwesomeButton>
            </View> 
          </View>
        </KeyboardAvoidingView>
      </View>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: '80%',
    marginLeft: '28%',
  },
  buttonContainer: {
    flex:1,
    width: width / 2,
    marginRight: (width / 2) - (width / 4)
  },
  item: {
    flexDirection: 'column',
    alignSelf:"center",
  },
  button:{
    marginTop: 10
  },
  input:{
    width:width / 2, 
    alignSelf:"center", 
    marginTop:10,
    marginRight: (width / 2) - (width / 4)
  }


});