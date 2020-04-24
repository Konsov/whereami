import React, { Component } from 'react';
import {
  View,
  ImageBackground,
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
var whoosh;

const { width, height } = Dimensions.get('window');

export default class HomeScreen extends Component {

  state = {
    modalVisible: false,
    player: '',
    uid: '',
    volume: true
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
  }

  handleAppStateChange(currentAppState) {
    if (currentAppState != 'active') {
      this.stop()
    } else {
      this.start()
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
      AsyncStorage.setItem('volume', 'false');
      whoosh.stop();    
      this.setState({
        volume: false
      })
    } else {
      AsyncStorage.setItem('volume', 'true');
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
    var coord = user.uid + this.state.uid
    firebase.database().ref('Games/').child(`${coord}`).set(
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
    ).then(firebase.database().ref('Games/').child(`${coord}`).update(
      {
        round: 1
      }
    ).then(this.setState({ 
      modalVisible: false 
    }))
    ).then(firebase.database().ref('users/' + user.uid + '/playRequest/').remove())
    .then(this.props.navigation.navigate('GameStack'))
  }

  

  componentDidMount() {
    if(this.props.navigation.getParam('volume') == "false"){
      this.setState({
        volume:false
      })
    } 

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
      var k = value.toJSON()
      this.setState({
        player: k["user"],
        uid: k["uid"]
      })
      this.setState({ 
        modalVisible: true
      })
    })
    firebase.database().ref('/users').child(`${user.uid}`).child('playRequest').on('child_removed', (value) => {
      
      this.setState({
        player: '',
        uid: ''
      })
      this.setState({ 
        modalVisible: false
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
      <View>        
        <Image source={require('../files/nuv3.gif')} style={{width: "100%", height: '100%' }}/>    


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
              <Text style={styles.contentTitle}>{this.state.player} want to play with you!</Text>
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
              onPress={() => this.giocaConAmici()}
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
    marginTop: -(height/2.6),
    flex:1,
    right: -(width / 5),
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
