import React, { Component } from 'react';

import {
  StyleSheet,
  View, Dimensions, BackHandler
} from 'react-native';
import StreetView from 'react-native-streetview';
import firebase from '../services/firebase';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';

import CountDown from 'react-native-countdown-component'

import { PacmanIndicator } from 'react-native-indicators';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class PlayScreen extends Component {

  state = {
    player: '',
    gameID: '',
    loadingCoordinate: false,
    preclatitude: -1,
    preclongitude: -1,
    latitude: 0,
    longitude: 0,
    round: 1,
    type: ''
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('HomeScreen'); 
      return true;
    });
    this.getGameInfo();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  getGameInfo(){
    const user = firebase.auth().currentUser;
    firebase.database().ref('/Games').orderByKey().startAt(`${user.uid}`).endAt(`${user.uid}\uf8ff`).once('value').then(function (snapshot) {
      
      var game = snapshot.toJSON();
      
      if(game != null){
        for(id in game){        
          this.setState({
            player: 'player1',
            type: game[id]['type']
          })
        }
      }else{
        this.setState({
          player: 'player2',
          type: 'multiplayer'
        })
      } 
    }.bind(this));

    this.loadCoordinate()
  }

  loadCoordinate() {
    const user = firebase.auth().currentUser;
    firebase.database().ref(`/Games`).orderByChild(`${this.state.player}/user`).once('value').then(function (snapshot) {
      console.log("Loading Coordinates..")
    
      var game = snapshot.toJSON();
      
      for(id in game){
      
        if (game[id]['coordinates'] == null || (game[id]['coordinates']['latitude'] == this.state.preclatitude && game[id]['coordinates']['longitude']== this.state.preclongitude)){
           this.setState({ loadingCoordinate: false })
            return this.loadCoordinate();
        }
      var gameID = id;
      var x = game[id]['coordinates']['latitude'];
      var y = game[id]['coordinates']['longitude'];
     
      break;
    }
      console.log(gameID)
      console.log(x);
      console.log(y);
      console.log(this.state.loadingCoordinate)
      this.setState({
        gameID: gameID,
        latitude: x,
        longitude: y,
        loadingCoordinate: true,
      })
      console.log(this.state.loadingCoordinate)
    }.bind(this));

  }

  goToMarker() {
    if (this.state.player == 'player1') {
      firebase.database().ref('Games/').child(`${this.state.gameID}`).update(
        {
          round: this.state.round + 1
        }
      )
    }
    
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
    this.props.navigation.navigate('InsertMarker', { lat: this.state.latitude, long: this.state.longitude, round: this.state.round + 1, score: score, gameID: this.state.gameID, player: this.state.player, timerID: timerID, type: this.state.type})
    
    this.setState({
      round: this.state.round + 1,
      loadingCoordinate: false,
      preclatitude: this.state.latitude,
      preclongitude: this.state.longitude
    })
      
    this.loadCoordinate() 
  }


  renderView() {

    if (this.state.player == '' || this.state.loadingCoordinate == false) {
      return <PacmanIndicator size={100} />
    } else {
      return (
        <View style={styles.container}>
          <StreetView
            style={styles.streetView}
            allGesturesEnabled={true}
            coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude, radius: 10000 }} />
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
                until = {30}
                onFinish={() => this.goToMarker()}
                digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
                digitTxtStyle={{color: '#1CC625'}}
                timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                separatorStyle={{color: '#1CC625'}}
                timeToShow={['S']}
                timeLabels={{s: null}}
            />
         
          </View>
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
    bottom: 0,
  },
  answerButton: {
    position: 'absolute',
    top: windowHeight/25,
    right: windowWidth/30
  },

  timer: {
    position: 'absolute',
    top: windowHeight/40,
    left: windowWidth/30
  }

});