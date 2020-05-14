import React, { Component } from 'react';

import {
  StyleSheet,
  View, Dimensions, BackHandler, Modal,TouchableHighlight,Image, Text,
} from 'react-native';
import StreetView from 'react-native-streetview';
import firebase from '../services/firebase';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';

import CountDown from 'react-native-countdown-component'

import { PacmanIndicator } from 'react-native-indicators';
import { Label } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class PlayScreen extends Component {

  state = {
    player: 'not assigned',
    username: '',
    oppoUsername: '',
    
    gameID: '',
    
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
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.setState({
        modalVisible:true
      })
      return true;
    });
    this.getGameInfo();
  }

  componentWillUnmount() {
    this.backHandler.remove();
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
          console.log(game)
          for (var id in game) {
            this.setState({
              gameID: id,
              player: 'player1',
              type: game[id]['type'],
              username: game[id]['player1']['username'],
              })
              
            console.log(`${this.state.username} has loaded the game: `)
            console.log(`Game: ${this.state.gameID}`)
            console.log(`type: ${this.state.type}`)
            console.log(`${this.state.username} is the player 1`)
            
            if(game[id]['type'] == 'multiplayer'){
              this.setState({
                oppoUsername: game[id]['player2']['username']
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
              oppoUsername: game[id]['player1']['username']
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
  
      var retry = setTimeout(()=>{
        return this.getGameInfo()
      }, 5000)
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
    firebase.database().ref(`/Games`).orderByChild(`${this.state.gameID}`).once('value').then(function (snapshot) {

    var game = snapshot.toJSON()

      for(id in game){
        if (game[id]['roundCoordinates'] == null){
          console.log("Loading Coordinates..")
          return this.loadCoordinate();
        }
        
        var gameID = id;
        var x1 = game[id]['roundCoordinates']['round_1']['latitude'];
        var y1 = game[id]['roundCoordinates']['round_1']['longitude'];
        var x2 = game[id]['roundCoordinates']['round_2']['latitude'];
        var y2 = game[id]['roundCoordinates']['round_2']['longitude'];
        var x3 = game[id]['roundCoordinates']['round_3']['latitude'];
        var y3 = game[id]['roundCoordinates']['round_3']['longitude'];
        var x4 = game[id]['roundCoordinates']['round_4']['latitude'];
        var y4 = game[id]['roundCoordinates']['round_4']['longitude'];
        var x5 = game[id]['roundCoordinates']['round_5']['latitude'];
        var y5 = game[id]['roundCoordinates']['round_5']['longitude']

        break;
    }

    this.props.navigation.setParams({runTimer: true });

    console.log(`${this.state.username} has loaded the coordiantes: `)
    console.log('round 1: ',x1,y1)
    console.log('round 2: ',x2,y2)
    console.log('round 3: ',x3,y3)
    console.log('round 4: ',x4,y4)
    console.log('round 5: ',x5,y5)
  
    this.setState({
        gameID: gameID,
        
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

    this.props.navigation.navigate('InsertMarker', { lat: this.getRoundLatitude(), long: this.getRoundLongitude(), round: this.state.round, score: score, gameID: this.state.gameID, player: this.state.player, timerID: timerID, type: this.state.type, username: this.state.username, oppoUsername: this.state.oppoUsername})
    

    this.setState({
      round: this.state.round+1,
    })

  }

  eliminateGame(){
    const user = firebase.auth().currentUser;
    firebase.database().ref('/Games').orderByChild('player1/user').equalTo(`${user.uid}`).once('value').then(function (snapshot) {
      var game = snapshot.toJSON()
      if(game[id]['type'] == 'single'){
        firebase.database().ref(`/Games/${user.uid}`).remove()
      }
    })
  }

 
  renderView() {

    if (this.state.player == 'not assigned' || this.state.loadingCoordinate == false) {
      return <PacmanIndicator size={100} />
    } else {
      return (
        <View style={styles.container}>
          <StreetView
            style={styles.streetView}
            allGesturesEnabled={true}
            coordinate={{ latitude: this.getRoundLatitude(), longitude: this.getRoundLongitude(), radius: 100000 }} />
          <View>
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
                  <Text style={styles.contentTitle}>Do you really want to quit the game?</Text>
                  <View style = {{flexDirection:'row'}}>
                  <TouchableHighlight
                      onPress={() => {this.setState({ modalVisible:false}), this.props.navigation.navigate("HomeScreen"),this.eliminateGame()}}
                      style={styles.buttons}
                      underlayColor="transparent"
                      activeOpacity= {0.7}  
                      ><Image
                        style={{width: 40,height: 40}}
                        source={require('../files/success.png')}/>
                  </TouchableHighlight>
                  <TouchableHighlight
                      onPress={() => {this.setState({ modalVisible:false})}}
                      underlayColor="transparent"
                      activeOpacity= {0.7}  
                      style={styles.buttone}
                      ><Image
                        style={{width: 40,height: 40}}
                        source={require('../files/error.png')}/>
                  </TouchableHighlight>
                  </View>
              </View>
                
            </View>
          </Modal> 
          
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderView()}
        
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
    bottom: -40,
  },

  answerButton: {
    position: 'absolute',
    top: windowHeight/25,
    right: windowWidth/30
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

  timer: {
    position: 'absolute',
    top: windowHeight/40,
    left: windowWidth/30
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
  },
  buttons: {
    flex:1,
    position: 'relative',
    width:40,
    height:40,
    left:windowWidth/6
  },
  buttone: {
    flex:1,
    position: 'relative',
    width:40,
    height:40,
    left: windowWidth / 12

  }

});