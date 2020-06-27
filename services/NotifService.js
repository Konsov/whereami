
import React, {Component} from "react";
import {
  View, Text, StyleSheet, Dimensions, Image, ScrollView
} from 'react-native';
import Modal from 'react-native-modal';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import PushNotification from "react-native-push-notification";
import firebase from './firebase'


const width = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class NotifService extends Component {

  
  state = {
    lastId:0,
    modalVisible: false,
    modalVisibleBadge: false,
    badge:'',

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
      console.log(notification)
        var mess = notification.message.toString().split(" ");
        if(mess[0]=="badge"){
          var badge = mess[1].split(",");
          
          this.setState({
            modalVisibleBadge:true,
            badge:badge
          })
        }else {          
          this.setState({
            modalVisible:true
          })
        }
      
      
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
            animationType = "slide"
            onBackdropPress={() => this.setState({modalVisibleScore:false})}>
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
          <Modal
            testID={'modal2'}
            visible={this.state.modalVisibleBadge}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            transparent = {true}
            animationType = "slide"
            onBackdropPress={() => this.setState({modalVisibleBadge:false})}>
            <View style={styles.content}>
              <View style={styles.modalView}>
                {this.state.modalVisibleBadge == true ? 
                <ScrollView horizontal={true}>
                    {this.state.badge.map((value,key) =>{
                      return (
                        <View key={key}>
                          {console.log(value.toString())}
                          {value == 'gold' ? <Image
                            style={{ width: width / 5, height: width / 5}}
                            source={require('../files/gold.png')}
                          />: value == 'silver' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/silver.png')}
                          />: value == 'bronze' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/bronze.png')}
                          />: value == 'fire' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/fire.png')}
                          />: value == 'gold_2' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/gold_2.png')}
                          />: value == 'silver_2' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/silver_2.png')}
                          />: value == 'bronze_2' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/bronze_2.png')}
                          />: value == 'time' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/stopwatch.png')}
                          />: value == 'game_1' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/game_1.png')}
                          />: value == 'game_2' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/game_2.png')}
                          />: value == 'game_3' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/game_3.png')}
                          />: value == 'center' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/target.png')}
                          />: value == 'flower' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/flower.png')}
                          />: value == 'extrovert' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/group.png')}
                          />: value == 'gamer' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/joystick.png')}
                          />: value == 'doppelganger' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/lens.png')}
                          />: value == 'red-card' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/red-card.png')}
                          />: value == 'yellow-card' ? <Image
                          style={{ width: width / 5, height: width / 5}}
                          source={require('../files/yellow-card.png')}
                          />: null}
                        </View>
                      )})}
                </ScrollView> : null}
                
                  <Text style={styles.contentTitle}>You have a new badge!</Text>
                  <View style = {{flexDirection:'row'}}>
                    
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
    marginBottom: windowHeight / 4
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