import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Alert
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

export default class UsernameAddScreen extends Component{

    
    state = {
      username: '',
      showAlert:false
    }
  
    showAlert = () => {
        this.setState({
          showAlert: true,
        });
      };
      
      hideAlert = () => {
        this.setState({
          showAlert: false
        });
      };

  signUpUser = (username) => {
    try {
        const { currentUser } = firebase.auth();
        let rootRef = firebase.database().ref();

        rootRef
        .child('users')
        .orderByChild('username')
        .equalTo(username)
        .once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                let userData = snapshot.val();
                this.showAlert()
                return userData;
            } else {                
                try {
                    firebase.database().ref(`/users/${currentUser.uid}/`)
                    .update({
                        username: username,
                    });
                    currentUser.updateProfile({
                        displayName: username            
                    })
                    this.props.navigation.navigate('WelcomeScreen')
                } catch (error) {
                Alert.alert(error.toString());
                }
            }
        });
      
    } catch (error) {
      Alert.alert(error.toString())
    }
  }

  render(){
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
          </View>         
          <View style={styles.containerButtons}>
            <AwesomeButton
              type="secondary"
              stretch = {true}
              style={styles.button}
              onPress={() => this.signUpUser(this.state.username)}
            >Set up username
            </AwesomeButton>
          </View>           
          
          </View>
          <AwesomeAlert
            show= {this.state.showAlert}
            title="Error"
            message="This username is already taken"
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