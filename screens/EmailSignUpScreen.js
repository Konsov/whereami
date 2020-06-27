import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  BackHandler,
  Apps
} from 'react-native';

import {
  Item,
  Label,
  Input,
} from 'native-base';

import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";
import AwesomeAlert from 'react-native-awesome-alerts';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import firebase from '../services/firebase'

export default class EmailSignUpScreen extends Component{

    
    state = {
      username: '',
      email: '',
      password: '',
      showAlert: false,
      error_text:''
    }

    componentDidMount() {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.props.navigation.navigate('EmailSignUpScreen');
      });
    }
    componentWillUnmount() {
      this.backHandler.remove();
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
  

  signUpUser = (username,email, password) => {
    try {

      let rootRef = firebase.database().ref();

      rootRef
        .child('users')
        .orderByChild('username')
        .equalTo(username)
        .once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            let userData = snapshot.val();
            var taken = "Username already taken";
            this.showAlert(taken);
            return userData;
          } else {
            firebase.auth().createUserWithEmailAndPassword(email,password).then(() => {
              const { currentUser } = firebase.auth();
                try {
                  firebase.database().ref(`/users/${currentUser.uid}/`)
                  .set({
                      username: username,
                      userpic: 'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png',
                      last_access: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString().split("T")[0],
                      statistics:{
                        day_in_row:1,
                        nGames:0,
                        avgScore: 0,
                        maxScore: 0,
                        win:0,
                        nGames_sing:0,
                        nGames_multi:0,
                        win_in_row:0,
                        badge : {
                          fire: false,
                          center: false,
                          time: false,
                          gamer:false,
                          extrovert:false,
                          doppelganger:false
                        }
                        }
                  });
                  currentUser.updateProfile({
                    displayName: username,
                    photoURL: 'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png'              
                  })
                  console.log(currentUser.uid)
      
              } catch (error) {
                Alert.alert(error.toString());
              }
            }).catch((error) => {
              // Handle Errors here.
              var errorMessage = error.message;
              
              this.showAlert(errorMessage)
              // ...
            });
          }
      });

      
    } catch (error) {
      Alert.alert(error.toString())
    }
  }

  render(){
    
    const {showAlert} = this.state.showAlert;
    
    const {error_text} = this.state.error_text;
    return (
      <View>
        <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>
        <Image source={require('../files/logo.png')} style={{position:'absolute', marginTop: windowHeight / 15, alignSelf:'center'}}/>
        
        <View style={styles.container}>
          <View style={styles.containerItems}>          
            <Item floatingLabel>
              <Label style = {{color: "#FFFFFF"}}>Username</Label>
              <Input 
                autoCorrect={false}
                autoCapitalize="none"
                style={{color:'white', fontWeight:'bold'}}
                underlineColorAndroid = "white"
                onChangeText={(username) => this.setState({username})} />
            </Item>
            <Item floatingLabel style={styles.item}>
              <Label style = {{color: "#FFFFFF"}}>Email</Label>
              <Input 
                autoCorrect={false}
                autoCapitalize="none"
                style={{color:'white', fontWeight:'bold'}}
                underlineColorAndroid = "white"
                onChangeText={(email) => this.setState({email})} />
            </Item>        
            <Item floatingLabel style={styles.item}>
              <Label style = {{color: "#FFFFFF"}}>Password</Label>
              <Input 
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                style={{color:'white', fontWeight:'bold'}}
                underlineColorAndroid = "white" 
                onChangeText={(password) => this.setState({password})}
              />
            </Item>
          </View>         
          <View style={styles.containerButtons}>
            <AwesomeButton
              type="primary"
              stretch = {true}
              style={styles.button}
              onPress={() => this.signUpUser(this.state.username, this.state.email, this.state.password)}
            >Sign Up
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
  containerButtons:{
    alignSelf: 'center',
    width: windowWidth/2,
    marginTop:windowHeight/20,
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