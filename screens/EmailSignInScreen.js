import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
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

import firebase from '../services/firebase'

export default class EmailSignInScreen extends Component{

  constructor(props){
    super(props)
    
    this.state = ({
      email: '',
      password: ''
    })
  }

  signUpUser = (email, password) => {
    try {
      firebase.auth().createUserWithEmailAndPassword(email,password).then(() => {
        const { currentUser } = firebase.auth();
          try {
            firebase.database().ref(`/users/${currentUser.uid}/`)
            .set({
                name: 'gianpietro',
                userpic: 'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png',
            });
        } catch (error) {
          console.log(error);
        }
      })
    } catch (error) {
      console.log(error.toString())
    }
  }

  loginUser = (email, password) => {
    try {
        firebase.auth().signInWithEmailAndPassword(email,password).then(function(user){
          if(user){
            console.log(user);
            this.props.navigate.navigate('AppStack')
          }
        })
    } catch (error) {
      console.log(error.toString())
    }
  }

  render(){
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input 
            autoCorrect={false} 
            autoCapitalize="none"
            onChangeText={(email) => this.setState({email})} />
          </Item>
        
         <Item floatingLabel>
            <Label>Password</Label>
            <Input 
            secureTextEntry={true}
            autoCorrect={false} 
            autoCapitalize="none" 
            onChangeText={(password) => this.setState({password})}
            />
          </Item>

          <Button style={{marginTop:10}}
            full
            rounded
            success
            onPress={()=> this.loginUser(this.state.email, this.state.password)}
          ><Text>LogIn</Text>
          </Button>
          
          <Button style={{marginTop:10}}
            full
            rounded
            primary
            onPress={()=> this.signUpUser(this.state.email, this.state.password)}
          ><Text>Sign Up</Text>
          </Button>
        </Form>
      </Container>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:10,
    justifyContent: 'center',
  },
});