import React, { Component } from 'react';
import { View, StyleSheet, Button} from 'react-native';

import {LoginButton, AccessToken } from 'react-native-fbsdk';

const firebase = require('firebase')


export default class FBLoginButton extends Component {

   loginUser = () => {
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
                                        statistics:{
                                            nGames:0,
                                            avgScore: 0,
                                            maxScore: 0
                                            }
                                        });
                                }
                             })
                           
                            } catch (error) {
                            console.log(error.toString());
                        }
                    })
                })
            })

        } catch (error) {
        console.log(error.toString())
        }
    }

    render() {
        return (
        <View>
            <LoginButton
                publishPermissions={[['public_profile', 'email']]}
                onLoginFinished={
                    (error, result) => {
                    if (error) {
                        alert("Login failed with error: " + error.message);
                    } else if (result.isCancelled) {
                        alert("Login was cancelled");
                    } else {
                        alert("Login was successful with permissions: " + result.grantedPermissions)
                        this.loginUser()
                    }
                    }
                }/>
      </View>
        );
    }
};



module.exports = FBLoginButton;