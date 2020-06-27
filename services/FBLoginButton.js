import React, { Component } from 'react';
import { View, StyleSheet, Icon, Text, Image, Dimensions } from 'react-native';

import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';

const firebase = require('firebase')


const { width, height } = Dimensions.get('window');
export default class FBLoginButton extends Component {

    loginWithFacebook = () => {
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
          function(result) {
            if (result.isCancelled) {
              console.log('Login cancelled');
            } else {
              console.log(
                'Login success with permissions: ' +
                  result.grantedPermissions.toString(),
              );
              try {
                AccessToken.getCurrentAccessToken().then((data) => {
    
                    const token = data.accessToken
                    const credential = firebase.auth.FacebookAuthProvider.credential(token);
                    fetch('https://graph.facebook.com/v2.8/me?fields=id,first_name,last_name,email,gender,birthday&access_token=' + token)
                    .then((response) => response.json()).then((json) => {
    
                        const imageSize = 120
                        const facebookID = json.id
                        const name = json.first_name + ' ' + json.last_name
                        const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`
    
                        firebase.auth().signInWithCredential(credential).then(function(re){
                            try {
    
                                var ref = firebase.database().ref(`/users/${re.user.uid}`)
                                ref.once('value').then(snapUser => {
                                    if(!snapUser.exists()){
                                        ref.set({
                                            username: name,
                                            userpic: fbImage,
                                            last_access: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString().split("T")[0],
                                            statistics:{
                                                nGames:0,
                                                avgScore: 0,
                                                last_game: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString().split("T")[0],
                                                maxScore: 0,
                                                win:0,
                                                nGames_sing:0,
                                                nGames_multi:0,
                                                win_in_row:0,
                                                game_in_day:0,
                                                day_in_row:1,
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
                                    }
                                 })
                               
                                } catch (error) {
                                console.log(error.toString());
                            }
                        }).then(console.log("qui"))
                    })
                })
    
            } catch (error) {
            console.log(error.toString())
            }
            }
          }
        );
      };

    render() {
        return (
        <View>
            <View style={{flexDirection:'row'}}>
            <AwesomeButton
                type = "facebook"
                stretch = {true}
                onPress={() => this.loginWithFacebook()}
                ExtraContent = {
                    <Image source={require('../files/facebook_box.png')} style={{width:25, height:25,position:'absolute',alignSelf:'flex-start', marginLeft:1}}/>
                }
            ><Text style={{position:'absolute', color:'white',fontWeight:'bold',alignSelf:'flex-start', marginLeft:20, marginTop: 15}}>   Continue with facebook</Text>
            </AwesomeButton>
            </View>
        </View>
        );
    }
};



module.exports = FBLoginButton;