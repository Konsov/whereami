import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Alert,
  TouchableHighlight,
  Text,
  Image,
  AppState,
  AsyncStorage,
  Dimensions
} from 'react-native';

import Modal from 'react-native-modal'
import firebase from '../services/firebase';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import { LoginManager } from "react-native-fbsdk";
import Sound from "react-native-sound";
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

import NotifService from '../services/NotifService';
var whoosh;

const { width, height } = Dimensions.get('window');

export default class HomeScreen extends Component {

  state = {
    modalVisible: false,
    oppoUsername: '',
    volume: true
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
  }

  handleAppStateChange(currentAppState) {
    const user = firebase.auth().currentUser;
    
    if (currentAppState != 'active') {
      this.stop()
      firebase.database().ref(`/users/${user.uid}`).update({ online:false})
      
    } else {
      if(this.state.volume == true){        
        this.start()
      }
      firebase.database().ref(`/users/${user.uid}`).update({ online:true})
      
    }
  }
  
  refuseReq(val) {
    const user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid + '/playRequest/').remove()
    this.setState({ 
      modalVisible: false
    });
  }
  
  stop(){
    whoosh.stop();    
  }

  pause(data){
    if (data == true){
      AsyncStorage.setItem('volume', JSON.stringify(false));
      whoosh.stop();    
      this.setState({
        volume: false
      })
    } else {
      AsyncStorage.setItem('volume', JSON.stringify(true));
      whoosh.play();   
      this.setState({
        volume:true
      })
    }
  }

  start (){
    whoosh.play();
  }

  sound(){
    if (whoosh == null) {
        Sound.setCategory("Playback"); 
        whoosh = new Sound('game_music.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
        
        whoosh.setNumberOfLoops(-1);
        // Play the sound with an onEnd callback
        if (this.state.volume== true){
          whoosh.play()
        }
      });
      whoosh.release();
    }    
  }

  accReq(val){
    const user = firebase.auth().currentUser;
    var coord = user.uid + this.state.oppoUid
    firebase.database().ref('Games/').child(`${coord}`).set(
      {
        player1: {
          user: user.uid,
          username: user.displayName,
          score: 0,
          badge: {
            center: false
          }
        },
        player2: {
          user: this.state.oppoUid,
          username: this.state.oppoUsername,
          score: 0,
          badge: {
            center: false
          }
        },
        finished: false,
        type: 'multiplayer',
        date: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString().split("T")[0]

      }
    ).then(
      this.setState({ 
        modalVisible: false 
      })
    ).then(firebase.database().ref('users/' + user.uid + '/playRequest/').remove()).then(this.props.navigation.navigate('GameStack'))
  }

  

  componentDidMount() {

    AsyncStorage.getItem('volume').then(value => {
      
      if (value !=null){
        this.setState({
          volume: JSON.parse(value)
        })
      } else {
        AsyncStorage.setItem(
          'volume',
          JSON.stringify(true)
        );
      }
      //AsyncStorage returns a promise so adding a callback to get the value
      
      //Setting the value in Text
    });
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
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

    this.sound();

    firebase.database().ref('/users').child(`${user.uid}`).child('playRequest').on('child_added', (value) => {
      var oppo = value.toJSON()
      this.setState({
        oppoUid: oppo["uid"],
        oppoUsername: oppo["user"]
      })
      this.setState({ 
        modalVisible: true
      })
    })
    firebase.database().ref('/users').child(`${user.uid}`).child('playRequest').on('child_removed', (value) => {
      
      this.setState({
        player: ''
      })
      this.setState({ 
        modalVisible: false
      })
    })
  }

  logOut() {
    const user = firebase.auth().currentUser;
    firebase.database().ref(`/users/${user.uid}`).update({ online:false})
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
          username: user.displayName,
          score: 0,
          badge: {
            center: false
          }
        },
        finished: false,
        type: 'single',
        date: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString().split("T")[0]
      }
    ).then(this.props.navigation.navigate('GameStack'))
  }

  playOnline() {
    const user = firebase.auth().currentUser;

    firebase.database().ref('waitingRoom/' + user.uid).set(
      {
        user: user.uid,
        username: user.displayName,
        userpic: user.photoURL
      }
    )
    this.props.navigation.navigate('GameStack')
  }

  render() {
    return (
      <View>        
        <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>   
        <Image source={require('../files/logo.png')} style={{position:'absolute', marginTop:  height / 15, alignSelf:'center'}}/>


        <View style={styles.container}> 
        <TouchableHighlight
              style={styles.button1}
              onPress={() => this.pause(this.state.volume)}
            >{this.state.volume == true ? <Image
              style={{width: width / 10,height: width / 10, alignSelf:"center",top:6}}
              source={require('../files/volume.png')}
            />:<Image
            style={{width: width / 10,height: width / 10, alignSelf:"center",top:6}}
            source={require('../files/no_volume.png')}
          />}</TouchableHighlight>
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
              <Text style={styles.contentTitle}>{this.state.oppoUsername} want to play with you!</Text>
              <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                onPress={() => this.accReq(false)}
                style={styles.button}
                underlayColor="transparent"
                activeOpacity= {0.7}  
                ><Image
                  style={{width: 40,height: 40,left: 70}}
                  source={require('../files/success.png')}/>
              </TouchableHighlight>
              <TouchableHighlight
               onPress={() => this.refuseReq(false)}
               underlayColor="transparent"
               activeOpacity= {0.7}  
               style={{left: 5}}
               ><Image
                style={{width: 40,height: 40, left: 5, marginRight:75}}
                source={require('../files/error.png')}/>
              </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <View style={styles.buttonContainer}>
            <AwesomeButtonRick
              onPress={() => this.gioca()}
              type="anchor"
              stretch = {true}
              style={{marginBottom:20,top:150}}
            >PLAY
            </AwesomeButtonRick>

            <AwesomeButtonRick
              onPress={() => this.playOnline()}
              type="anchor"
              stretch = {true}
              style={{marginBottom:20,top:150}}
            >ONLINE</AwesomeButtonRick>

            <AwesomeButtonRick   
              onPress={() => this.props.navigation.navigate('UserProfileScreen')}
              style={{marginBottom:20,top:150}}
              type="anchor"
              stretch = {true}
            >PROFILE</AwesomeButtonRick>


            <AwesomeButtonRick             
              onPress={() => this.logOut()}  
              style={{top:150,marginBottom:20}}
              type="anchor"
              stretch = {true}
            >LOG OUT</AwesomeButtonRick>
          </View>


          </View> 
          <NotifService navigation={this.props.navigation}/>   
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

  button: {
    flex:1,
    position: 'relative',
  },

  button1: {
    position: "absolute",
    width: width / 8, 
    height: width / 8,  
    marginTop: -(height/2.5),
    flex:1,
    right: -(width / 4.3),
    alignItems: 'flex-end',
    backgroundColor:'#95d44a',
    borderRadius:50
    
  },

  image:{
    width: 150,
    height: 100
  },

  buttonContainer: {
    flex:1,
    width: width / 2.8,
    alignSelf: "center",
    marginTop: -180
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
