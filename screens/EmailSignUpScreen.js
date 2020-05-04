import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
} from 'react-native';

import {
  Item,
  Label,
  Input,
} from 'native-base';

import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";


const { width, height } = Dimensions.get('window');

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
      <View>
      <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>
      <Image source={require('../files/logo.png')} style={{position:'absolute', marginTop: height / 5, alignSelf:'center'}}/>
      <View style={styles.container}>
        <View style={styles.item}>
          
          <Item floatingLabel style= {styles.input}>
            <Label style = {{color: "#FFFFFF"}}>Username</Label>
            <Input 
              autoCorrect={false}
              autoCapitalize="none"
              style={{color:'white', fontWeight:'bold', fontSize:20}}
              underlineColorAndroid = "white"
              onChangeText={(username) => this.setState({username})} />
          </Item>

          <Item floatingLabel style= {styles.input}>
            <Label style = {{color: "#FFFFFF"}}>Email</Label>
            <Input 
              autoCorrect={false}
              autoCapitalize="none"
              style={{color:'white', fontWeight:'bold', fontSize:20}}
              underlineColorAndroid = "white"
              onChangeText={(email) => this.setState({email})} />
          </Item>
        
         <Item floatingLabel style= {styles.input}>
            <Label style = {{color: "#FFFFFF"}}>Password</Label>
            <Input 
              autoCorrect={false}
              autoCapitalize="none"
              style={{color:'white', fontWeight:'bold', fontSize:20}}
              underlineColorAndroid = "white" 
              onChangeText={(password) => this.setState({password})}
            />
          </Item>
         
          <View style={styles.buttonContainer}>
            <AwesomeButton
              type="anchor"
              stretch = {true}
              style={styles.button}
              onPress={() => this.signUpUser(this.state.username, this.state.email, this.state.password)}
            >Sign Up
            </AwesomeButton>
          </View> 
          </View>
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