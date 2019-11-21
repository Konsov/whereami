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

  loginUser = (email, password) => {
    try {
        firebase.auth().signInWithEmailAndPassword(email,password)
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
      
        </Form>
            
          <Button style={{marginTop:10}}
            full
            rounded
            primary
            onPress={()=>{this.props.navigation.navigate('EmailSignUpScreen')}}
          ><Text>Not all ready register? Sign Up!</Text>
          </Button>
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