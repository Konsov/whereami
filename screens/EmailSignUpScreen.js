import React, { Component } from 'react';
import {
 
  StyleSheet,

} from 'react-native';

import {
  Container,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";



import firebase from '../services/firebase'

export default class EmailSignUpScreen extends Component{

  constructor(props){
    super(props)
    
    this.state = ({
      username: '',
      email: '',
      password: ''
    })
  }

  signUpUser = (username,email, password) => {
    try {
      firebase.auth().createUserWithEmailAndPassword(email,password).then(() => {
        const { currentUser } = firebase.auth();
          try {
            firebase.database().ref(`/users/${currentUser.uid}/`)
            .set({
                username: username,
                userpic: 'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png',
                statistics:{
                  nGames:0,
                  avgScore: 0,
                  maxScore: 0
                  }
            });
            currentUser.updateProfile({
              displayName: username,
              photoURL: 'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png'              
            })
            console.log(currentUser.uid)

        } catch (error) {
          console.log(error);
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
            <Label>Username</Label>
            <Input 
            autoCorrect={false} 
            autoCapitalize="none"
            onChangeText={(username) => this.setState({username})} />
          </Item>

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
          <AwesomeButton
              type="primary"
              style={styles.button}
              onPress={() => this.signUpUser(this.state.username, this.state.email, this.state.password)}
            > Sign Up
               </AwesomeButton>
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
  button: {
    marginTop: 10
  }
});