import React, { Component } from 'react';

import {
  StyleSheet,
  View, Dimensions, BackHandler,TouchableHighlight,Image, Text, AppState
} from 'react-native';
import StreetView from 'react-native-streetview';
import firebase from '../services/firebase';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import Modal from 'react-native-modal';
import CountDown from 'react-native-countdown-component'
import { BarIndicator } from 'react-native-indicators';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class PlayScreen extends Component {

  state = {
    player: 'not assigned',
    username: '',
    userpic: '',
    oppoUsername: '',
    oppoUserpic: '',
    oppoUid:'',
    
    gameID: '',
    disabled: true,
    loadingCoordinate: false,
    latitude_1: 0,
    longitude_1: 0,
    latitude_2: 0,
    longitude_2: 0,
    latitude_3: 0,
    longitude_3: 0,
    latitude_4: 0,
    longitude_4: 0,
    latitude_5: 0,
    longitude_5: 0,
    loadingCoordinate : false,
    round: 0,
    type: '',
    modalVisible: false,
    counter:0,
    modalVisibleQuit:false
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.setState({
        modalVisible:true
      })
      return true;
    });
    this.getGameInfo();
    setTimeout(() => {this.setState({disabled:false})}, 5000);
    this.checkOpponent()
    
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
  }

  handleAppStateChange(currentAppState) {
    const user = firebase.auth().currentUser;
    
    if (currentAppState != 'active') {
      firebase.database().ref(`/users/${user.uid}`).update({ online:false})
      
    } else {
      firebase.database().ref(`/users/${user.uid}`).update({ online:true})
      
    }
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  checkOpponent(){
    if (this.state.oppoUsername == ''){
      setTimeout(() => {this.checkOpponent()}, 2000)
      return
    }

    firebase.database().ref('/Games').child(`${this.state.gameID}`).child('quit').on('child_added', (value) => {
      
      var p = value.toJSON() 
      if (p == this.state.oppoUid){        
        this.setState({modalVisibleQuit:true})            
        setTimeout(() => {this.props.navigation.navigate('AppStack')}, 4000);
      } else {        
        setTimeout(() => {this.props.navigation.navigate('AppStack')}, 4000);
      }
    })

    firebase.database().ref('/users').child(`${this.state.oppoUid}`).on('child_changed', (value) => { 
      var changed = value.toJSON();
      if (!changed){
        setTimeout(() => {
          firebase.database().ref()
          .child('users')
          .orderByChild('username')
          .equalTo(this.state.oppoUsername)
          .once('value')
          .then(snapshot => {
              var snap = snapshot.toJSON()
              for (var pp in snap) {
                if (!snap[pp]['online']){
                  firebase.database().ref(`/Games/${this.state.gameID}/`).update({quit:{quitter:this.state.oppoUid}})
                  this.setState({modalVisibleQuit:true})
                  setTimeout(() => {this.eliminateGame(false),this.props.navigation.navigate('AppStack')}, 4000);
                } 
              }
              
          })
        }, 20000);

      }
    }) 
    
    
  }

  getGameInfo(){
    const user = firebase.auth().currentUser;
    
    
    if(this.state.player != 'not assigned'){
      return null
    }
    
      console.log("Loading Game...")  
      firebase.database().ref('/Games').orderByChild('player1/user').equalTo(`${user.uid}`).once('value').then(function (snapshot) {
       
        if (snapshot.exists()) {
          var game = snapshot.toJSON()
          
          for (var id in game) {
            console.log(game[id]['player1'])
            this.setState({
              gameID: id,
              player: 'player1',
              type: game[id]['type'],
              username: game[id]['player1']['username'],
              userpic:game[id]['player1']['userpic']
              })
              
            console.log(`${this.state.username} has loaded the game: `)
            console.log(`Game: ${this.state.gameID}`)
            console.log(`type: ${this.state.type}`)
            console.log(`${this.state.username} is the player 1`)
            
            if(game[id]['type'] == 'multiplayer'){
              this.setState({
                oppoUsername: game[id]['player2']['username'],
                oppoUserpic:game[id]['player2']['userpic'],
                oppoUid: game[id]['player2']['user']
              })
              console.log(`${this.state.oppoUsername} is the player 2`)
            }
            
            return this.loadCoordinate()
          }
        }
      }.bind(this))
    
      firebase.database().ref('/Games').orderByChild('player2/user').equalTo(`${user.uid}`).once('value').then(function (snapshot) {
        if (snapshot.exists()) {
          var game = snapshot.toJSON()
          for (var id in game) {
            this.setState({
              gameID: id,
              player: 'player2',
              type: game[id]['type'],
              username: game[id]['player2']['username'],
              userpic:game[id]['player2']['userpic'],
              oppoUsername: game[id]['player1']['username'],
              oppoUserpic:game[id]['player1']['userpic'],
              oppoUid: game[id]['player1']['user']
              })
              console.log(`${this.state.username} has loaded the game: `)
              console.log(`Game: ${this.state.gameID}`)
              console.log(`type: ${this.state.type}`)
              console.log(`${this.state.oppoUsername} is the player 1`)
              console.log(`${this.state.username} is the player 2`)
            return this.loadCoordinate()
          }
        }
      }.bind(this))     
      
      let rootRef = firebase.database().ref();
      rootRef
      .child('waitingRoom')
      .orderByChild('username')
      .equalTo(user.displayName)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          var retry = setTimeout(()=>{
            return this.getGameInfo()
          }, 5000)
        } else { 
          return null
        }
      });
      
      
  }


  getRoundLatitude(){
    switch(this.state.round) {
      case 1:
        return this.state.latitude_1;
      case 2:
        return this.state.latitude_2;
      case 3:
        return this.state.latitude_3;
      case 4:
        return this.state.latitude_4;
      case 5:
        return this.state.latitude_5;  
      default:
        return 0;
      } 
  }
  getRoundLongitude(){
    switch(this.state.round) {
      case 1:
        return this.state.longitude_1;
      case 2:
        return this.state.longitude_2;
      case 3:
        return this.state.longitude_3;
      case 4:
        return this.state.longitude_4;
      case 5:
        return this.state.longitude_5;   
      default:
        return 0; 
      } 
  }

  loadCoordinate() {

    firebase.database().ref(`/Games/${this.state.gameID}`).once('value').then(function (snapshot) {

    var game = snapshot.toJSON()
    
    if (game['roundCoordinates'] == null){
      console.log("Loading Coordinates..")
      return this.loadCoordinate();
    }
        
      var x1 = game['roundCoordinates']['round_1']['latitude'];
      var y1 = game['roundCoordinates']['round_1']['longitude'];
      var x2 = game['roundCoordinates']['round_2']['latitude'];
      var y2 = game['roundCoordinates']['round_2']['longitude'];
      var x3 = game['roundCoordinates']['round_3']['latitude'];
      var y3 = game['roundCoordinates']['round_3']['longitude'];
      var x4 = game['roundCoordinates']['round_4']['latitude'];
      var y4 = game['roundCoordinates']['round_4']['longitude'];
      var x5 = game['roundCoordinates']['round_5']['latitude'];
      var y5 = game['roundCoordinates']['round_5']['longitude'];    

    this.props.navigation.setParams({runTimer: true });

    console.log(`${this.state.username} has loaded the coordiantes: `)
    console.log('round 1: ',x1,y1)
    console.log('round 2: ',x2,y2)
    console.log('round 3: ',x3,y3)
    console.log('round 4: ',x4,y4)
    console.log('round 5: ',x5,y5)
  
    this.setState({

      latitude_1: x1,
      longitude_1: y1,
      latitude_2: x2,
      longitude_2: y2,
      latitude_3: x3,
      longitude_3: y3,
      latitude_4: x4,
      longitude_4: y4,
      latitude_5: x5,
      longitude_5: y5,
        
      round: 1,

      loadingCoordinate: true,
    })

    }.bind(this));

  }

  goToMarker() {
    
    this.props.navigation.setParams({runTimer: false });

    if (this.props.navigation.getParam('timerID') == null) {
      var timerID = 'a'
    } else {
      var timerID = this.props.navigation.getParam('timerID')
    }

    if (this.props.navigation.getParam('score') == null) {
      var score = 0
    } else {
      var score = this.props.navigation.getParam('score')
    }

    this.props.navigation.navigate('InsertMarker', { lat: this.getRoundLatitude(), long: this.getRoundLongitude(), round: this.state.round, score: score, gameID: this.state.gameID, player: this.state.player, timerID: timerID, type: this.state.type, username: this.state.username, oppoUsername: this.state.oppoUsername, userpic:this.state.userpic, oppoUserpic:this.state.oppoUserpic})
    

    this.setState({
      round: this.state.round+1,
    })

  }

  eliminateGame(data){
    const user = firebase.auth().currentUser;
    let rootRef = firebase.database().ref();
    rootRef
    .child('waitingRoom')
    .orderByChild('username')
    .equalTo(user.displayName)
    .once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        firebase.database().ref(`/waitingRoom/${user.uid}`).remove()
      } else {                 
          if (data){
            firebase.database().ref(`/Games/${this.state.gameID}/`).update({quit:{quitter: user.uid}}).then(              
              firebase.database().ref(`/Games/${this.state.gameID}/`).remove()
            )
          } else {
            firebase.database().ref(`/Games/${this.state.gameID}/`).remove()            
          }
      }
    });    
  }



renderModalQuitGame(){
  return(
    <Modal
      testID={'modal1'}
      visible={this.state.modalVisibleQuit}
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
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{this.state.oppoUsername} left the game.</Text>
          <Text style={styles.modalText}>You will be redirected in the home page</Text>
          <BarIndicator style={{marginTop:windowHeight/23}} size={40} />
        </View>
    </Modal>
     
  )
}  
renderModalExitGame(){
  return(
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
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Are you sure to leave the game?</Text>
          <View style = {styles.buttonModalContainer}>
            <TouchableHighlight
              onPress={() => {this.setState({ modalVisible:false}), this.props.navigation.navigate("HomeScreen"),this.eliminateGame(true)}}
              underlayColor="transparent"
              activeOpacity= {0.7}  
              ><Image source={require('../files/success.png')} style={{width:windowWidth/9, height:windowWidth/9}}/>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {this.setState({ modalVisible:false})}}
              underlayColor="transparent"
              activeOpacity= {0.7}  
              ><Image source={require('../files/error.png')} style={{width:windowWidth/9, height:windowWidth/9,marginLeft:windowWidth/9}}/>
            </TouchableHighlight>
          </View>
        </View>
    </Modal> 
  )
}

  renderView() {

    if (this.state.player == 'not assigned' || this.state.loadingCoordinate == false) {
      
      return (<View style={{ marginTop:windowHeight/3.5, height: windowHeight/3.5}}>
        <Image source={require('../files/logo2.png')} style={{width: '100%', height: '100%',resizeMode: 'stretch'}}/>
        <BarIndicator style={{marginTop:windowHeight/23}} size={40} />
        <AwesomeButtonRick
              onPress={() => this.setState({
                modalVisible:true
              })}
              type="anchor"
              style={styles.cancelButton}
              width={150}
              disabled={this.state.disabled}
            >CANCEL
        </AwesomeButtonRick>
        {this.renderModalExitGame()}
        </View>)
    } else {
      return (
        <View style={styles.container}>

          {this.renderModalExitGame()}

          <StreetView
            style={styles.streetView}
            allGesturesEnabled={true}
            coordinate={{ latitude: this.getRoundLatitude(), longitude: this.getRoundLongitude(), radius: 100000 }} />
         
         
            <AwesomeButtonRick
              onPress={() => this.goToMarker()}
              type="anchor"
              style={styles.answerButton}
            >GIVE ANSWER
            </AwesomeButtonRick>
            

            <CountDown
                id = {this.props.navigation.getParam('timerID')}
                style={styles.timer}
                size={windowWidth/15}
                until = {59}
                onFinish={() => this.goToMarker()}
                digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
                digitTxtStyle={{color: '#1CC625'}}
                timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                separatorStyle={{color: '#1CC625'}}
                timeToShow={['S']}
                timeLabels={{s: null}}
                running = {this.props.navigation.getParam('runTimer')}
            />
          
          </View>

      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderView()}
        {this.renderModalQuitGame()}
        
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  
  streetView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -windowHeight/25,
  },

  answerButton: {
    position: 'absolute',
    top: windowHeight/25,
    right: windowWidth/30,
  },

  cancelButton: {
    position: 'absolute',
    top: (windowHeight/2),
    right: windowWidth/3.2
  },

  buttonModalContainer:{
    flexDirection:'row',
    marginTop: windowHeight/40,
  },

  modalText: {
    fontSize: windowHeight/33
  },

  timer: {
    position: 'absolute',
    top: windowHeight/40,
    left: windowWidth/30
  },

  modalView: {
    alignItems: 'center',
    backgroundColor: "white",
    padding: windowHeight/19,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

});