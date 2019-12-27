import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  BackHandler,
  Alert,
  Button,
  Text
} from 'react-native';

import Modal from 'react-native-modal'
import firebase from '../services/firebase';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";
import { LoginManager } from "react-native-fbsdk";


export default class HomeScreen extends Component {

  state = {
    modalVisible: false,
    player: '',
    uid: ''
  }

  refuseReq(val) {
    const user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid + '/playRequest/').remove()
    this.setState({ 
      modalVisible: false
    });
  }

  accReq(val){
    const user = firebase.auth().currentUser;
    firebase.database().ref('Games/').child(`${user.uid}`).set(
      {
        player1: {
          user: user.uid,
          score: 0
        },
        player2: {
          user: this.state.uid,
          score: 0
        },
        round: 0,
        finished: false
      }
    ).then(firebase.database().ref('Games/').child(`${user.uid}`).update(
      {
        round: 1
      }
    ).then(this.setState({ 
      modalVisible: false 
    }))
    ).then(this.props.navigation.navigate('GameStack'))
  }

  

  componentDidMount() {
    const user = firebase.auth().currentUser;
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Confirm exit',
        'Do you want to quit the app?',
        [
          { text: 'CANCEL', style: 'cancel' },
          { text: 'OK', onPress: () => BackHandler.exitApp() },
        ],

      );
      return true;
    });

    firebase.database().ref('/users').child(`${user.uid}`).child('playRequest').on('child_added', (value) => {
      var k = value.toJSON()
      this.setState({
        player: k["user"],
        uid: k["uid"]
      })
      this.setState({ 
        modalVisible: true
      })
    })
  }

  logOut() {
    firebase.auth().signOut();
    this.props.navigation.navigate('AuthStack');
    LoginManager.logOut();
  }

  gioca() {
    const user = firebase.auth().currentUser;
    firebase.database().ref('Games/').child(`${user.uid}`).set(
      {
        player1: {
          user: user.uid,
          score: 0
        },
        round: 0,
        finished: false
      }
    ).then(firebase.database().ref('Games/').child(`${user.uid}`).update(
      {
        round: 1
      }
    ).then(this.props.navigation.navigate('GameStack')))
  }

  giocaConAmici() {
    const user = firebase.auth().currentUser;
    firebase.database().ref('waitingRoom/' + user.uid).set(
      {
        user: user.uid
      }
    )
    this.props.navigation.navigate('GameStack')
  }

  render() {
    return (

      <ImageBackground source={require('../files/hom.png')} style={{ width: '100%', height: '100%' }}>

        <View style={styles.container}>

          <Modal
            testID={'modal'}
            isVisible={this.state.modalVisible}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}>
            <View style={styles.content}>
              <Text style={styles.contentTitle}>{this.state.player} want to play with you!</Text>
              <View style={{ flexDirection: 'row' }}>
                <AwesomeButton
                  type="primary"
                  style={styles.button}
                  
                  width = {60}
                  onPress={() => this.accReq(false)}
                >✔</AwesomeButton>
                <AwesomeButton
                  type="primary"
                  style={styles.button}
                  width = {60}
                  onPress={() => this.refuseReq(false)}
                >✘</AwesomeButton>
              </View>
            </View>
          </Modal>


          <View style={styles.buttonContainer}>
            <AwesomeButton
              type="primary"
              style={styles.button}
              stretch={true}
              onPress={() => this.gioca()}
            >Gioca</AwesomeButton>

            <AwesomeButton
              type="primary"
              style={styles.button}
              stretch={true}
              onPress={() => this.giocaConAmici()}
            >Gioca con Amici</AwesomeButton>

            <AwesomeButton
              type="primary"
              style={styles.button}
              stretch={true}
              onPress={() => this.props.navigation.navigate('UserProfileScreen')}
            >Profile</AwesomeButton>


            <AwesomeButton
              type="primary"
              style={styles.button}
              stretch={true}
              onPress={() => this.logOut()}
            >Log Out</AwesomeButton>
          </View>


        </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: '80%',
    marginLeft: '28%',
  },

  button: {
    position: 'relative',
    marginTop: 10,
    
  },

  buttonContainer: {
    width: 150,
    alignSelf: "center",
    marginTop: -100
  },

  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },




})
