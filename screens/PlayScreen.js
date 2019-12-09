import React, { Component } from 'react';

import {
  StyleSheet,
  View, Dimensions, ActivityIndicator,Text
} from 'react-native';
import StreetView from 'react-native-streetview';
import firebase from '../services/firebase';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";
import {PacmanIndicator} from 'react-native-indicators';

const { width } = Dimensions.get('window');

export default class PlayScreen extends Component {

   state = {
    player: '',
    gameID: '',
    loadingCoordinate: false,
    preclatitude: 0,
    preclongitude:0,
    latitude: 0,
    longitude: 0,
    round: 1
    }

  componentDidMount(){
  this.IsNumberOne();
  this.IsNumberTwo();
  }

  componentDidUpdate(){
    if(!this.state.loadingCoordinate && this.state.round < 6){
      this.loadCoordinate();
    }
  }  

  loadCoordinate() {

    const user = firebase.auth().currentUser

    firebase.database().ref('/Games').orderByChild(`${this.state.player}/user`).equalTo(`${user.uid}`).once('value').then(function (snapshot) {
      var game = snapshot.toJSON()
            
      for (var id in game) {
        
        if(game[id]['coordinates'] == null || game[id]['coordinates']['latitude'] == this.state.preclatitude ){
          this.setState({loadingCoordinate: false})
          return null
        }
        var x = game[id]['coordinates']['latitude'];
        var y = game[id]['coordinates']['longitude'];
      }
      console.log(x);
      console.log(y);
      console.log(this.state.loadingCoordinate)  
      this.setState({
        latitude: x,
        longitude: y,
        loadingCoordinate: true
      })
      console.log(this.state.loadingCoordinate)
    }.bind(this));

   }

 IsNumberTwo() {
    const user = firebase.auth().currentUser
  
    var ref = firebase.database().ref('/Games');
    ref.orderByChild('player2/user').equalTo(`${user.uid}`).once('value').then(function (snapshot) {

      if (snapshot.exists()) {
        var game = snapshot.toJSON()
      	for (var id in game) {
          var gameID = id
        }
        console.log(gameID)
        this.setState({
          player: 'player2',
          gameID: gameID
          })
      }
    }.bind(this))
  }


  IsNumberOne() {
    const user = firebase.auth().currentUser
  
    var ref = firebase.database().ref('/Games');
    ref.orderByChild('player1/user').equalTo(`${user.uid}`).once('value').then(function (snapshot) {

      if (snapshot.exists()) {
        var game = snapshot.toJSON()
      	for (var id in game) {
          var gameID = id
        }
        this.setState({
          player: 'player1',
          gameID: gameID
          })
     }
    }.bind(this))
  }

  goToMarker(){

    firebase.database().ref('Games/').child(`${this.state.gameID}`).update(
      {
        round: this.state.round + 1
      }
    ).then(function(){
        if(this.props.navigation.getParam('score') == null){
          var score = 0
        }else{
          var score = this.props.navigation.getParam('score')
        }
        this.props.navigation.navigate('InsertMarker', {lat: this.state.latitude, long: this.state.longitude, round: this.state.round + 1, score: score, gameID: this.state.gameID, player: this.state.player})
      
        this.setState({
                  round: this.state.round + 1,
                  loadingCoordinate: false,
    	            preclatitude: this.state.latitude,
                  preclongitude: this.state.longitude
                  })
    }.bind(this))
  }

  renderView(){
    if(this.state.player == '' || this.loadingCoordinate == false){
      return <PacmanIndicator size = {100} />
    }else{
      return(
        <View style={styles.container}>
          <StreetView
            style={styles.streetView}
            allGesturesEnabled={true}
            coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude, radius: 100000 }}/>
              <View>
               <AwesomeButton
                type="primary"
                style={styles.button}
                onPress={()=>this.goToMarker()}
                > Give the Answer
               </AwesomeButton>
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
  button: {
    position: 'absolute',
    top: 20,
    left: width - 150,
    right: 100,
    zIndex: 2
  },
  timer: {
    position: 'absolute',
    left: 100,
    top: 1000
  }
});