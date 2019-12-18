import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  StatusBar,
} from 'react-native';

import {
  Container,
  Form,
  Item,
  Label,
  Button,
  Input,
} from 'native-base';

import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

import firebase from '../services/firebase'

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
     
      <Container style={styles.container}>
       
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(email) => this.setState({ email })} />
          </Item>

          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(password) => this.setState({ password })}
            />
          </Item>
          <View style={styles.buttonContainer}>
            <AwesomeButton
              type="primary"
              stretch = "true"
              style={styles.button}
              onPress={() => this.loginUser(this.state.email, this.state.password)}
            > Login
               </AwesomeButton>
            <AwesomeButton
              type="secondary"
              stretch = "true"
              style={styles.button}
              onPress={() => { this.props.navigation.navigate('EmailSignUpScreen') }}
            > Not all ready register? Sign Up!
               </AwesomeButton>
          </View> 
     </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
    alignSelf: 'center'
  },
  buttonContainer: {
    width:150,
    alignSelf: "center",
  }
});