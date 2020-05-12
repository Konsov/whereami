
import React, {Component} from "react";
import {
  View, Modal, Text, StyleSheet, Dimensions
} from 'react-native';

import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import PushNotification from "react-native-push-notification";
import firebase from './firebase'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class NotifService extends Component {

  
  state = {
    lastId:0,
    modalVisible: false
  }

  componentDidMount(){
    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        
        onRegister: (token) => {
          var user = firebase.auth().currentUser;

          firebase.database().ref(`users/${user.uid}/token`).once('value').then(function (snapshot) {
            if (snapshot == undefined){
              firebase.database().ref(`users/${user.uid}`).set({
                token : token.token
              })
            } else if (snapshot.val() != token.token){
              firebase.database().ref(`users/${user.uid}`).update({
                token : token.token
              })
            }
          })
          console.log("TOKEN:", token);
        },
        
        // (required) Called when a remote or local notification is opened or received
        onNotification: (notification) => {
          this.localNotif(notification);
          // process the notification here
      
        },
        // Android only
        senderID: "543229345691",
        // iOS only
        permissions: {
          alert: true,
          badge: true,
          sound: true
        },
        popInitialNotification: true,
        requestPermissions: true
      });
  }

    localNotif(notification) {
        this.setState({
          modalVisible:true
        })
      
      
    }

    render(){
        return (
          <View style = {styles.container}>
            <Modal
            testID={'modal1'}
            visible={this.state.modalVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            transparent = {true}
            animationType = "slide">
            <View style={styles.content}>
              <View style={styles.modalView}>
                  <Text style={styles.contentTitle}>You have a new friend request!</Text>
                  <View style = {{flexDirection:'row'}}>
                    <AwesomeButtonRick
                      onPress={() => {this.props.navigation.navigate('NotificationScreen'), this.setState({modalVisible:false})}}
                      type="anchor"
                      style={{left:5, alignItems:"center"}}
                      >GO TO HUB
                      </AwesomeButtonRick>
                  </View>
              </View>
                
            </View>
          </Modal>
          </View>
        )
    }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: windowHeight / 3,
    marginBottom: windowHeight / 3
  },

  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }

});