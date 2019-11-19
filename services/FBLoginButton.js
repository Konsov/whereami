import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
const firebase = require('firebase');

export default class FBLoginButton extends Component {
    render() {
        return (
            <View>
                <LoginButton 
                    permissions={["email", "user_friends", "public_profile"]}
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("Login failed with error: " + error.message);
                            } else if (result.isCancelled) {
                                alert("Login was cancelled");
                            } else {
                                
                                AccessToken.getCurrentAccessToken()
                                .then((data) => {
                                   
                                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);;
                                
                                firebase.auth().signInWithCredential(credential).then(credential => {
                                    
                                    console.log(credential.user.email, credential.user.photoURL, credential.user.displayName);
                                });

                                });
                            }
                        }
                    }
                    onLogoutFinished={() => alert("User logged out")} />
            </View>
        );
    }
};

module.exports = FBLoginButton;