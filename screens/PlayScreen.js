import React, { Component } from 'react';

import {
  StyleSheet,
  View, Dimensions, ActivityIndicator
} from 'react-native';
import StreetView from 'react-native-streetview';
import firebase from '../services/firebase';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";
import {PacmanIndicator} from 'react-native-indicators';

const { width } = Dimensions.get('window');

export default class PlayScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      round: 1,
      score: 0,
      player: '',
      loadingCoordinate: false,
      latitude: 0,
      longitude: 0
    };
  }
  loadView() {
    var x = 100;
    if (this.state.player == '') {
      setTimeout(function(){this.getPlayerNumber()}.bind(this),9000);
      
      return <PacmanIndicator size = {x} />;
    } else if (this.state.player == "partita non ancora caricata") {
      setTimeout(function(){
        this.setState({player: ''});
        () => loadView();
      }.bind(this), 2000)
      return <PacmanIndicator size = {x} />;
    } else {

      if (!this.state.loadingCoordinate) {
        return <PacmanIndicator size = {x} />;
      } else {
        return (
          <StreetView
            style={styles.streetView}
            allGesturesEnabled={true}
            coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude, radius: 100000 }}
          />
        );
      }
    }
  }

  getPlayerNumber() {
    const user = firebase.auth().currentUser
  
    var ref = firebase.database().ref('/Games');
    ref.orderByChild('player1').equalTo(`${user.uid}`).once('value').then(function (snapshot) {

      if (snapshot.exists()) {
        this.setState({ player: 'player1' })
        console.log(this.state.player)
        return this.state.player
      } else {
        return this.state.player
      }

    }.bind(this)).then(function (data) {
      if (data == 'player1') {
        return this.loadCoordinate();
      } else {
        ref.orderByChild('player2').equalTo(`${user.uid}`).once('value').then(function (snapshot) {

          if (snapshot.exists()) {
            this.setState({ player: 'player2' })
            console.log(this.state.player)
            return this.loadCoordinate();
          } else {
            this.setState({player:"partita non ancora caricata"})
            return this.state.player
          }
        }.bind(this))
      }
    }.bind(this))
  }

  loadCoordinate() {

    const user = firebase.auth().currentUser

    firebase.database().ref('/Games').orderByChild(`${this.state.player}`).equalTo(`${user.uid}`).once('value').then(function (snapshot) {
      var game = snapshot.toJSON()
      for (var id in game) {
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
      console.log(this.state.latitude)
    }.bind(this));

  }

  refresh = (data) => {
    const user = firebase.auth().currentUser
    this.setState({
      round: this.state.round + 1,
      score: data
    })


    
  }

  componentDidUpdate() {
    const user = firebase.auth().currentUser
    console.log(this.state.round)
    console.log(this.state.score)
    if (this.state.round > 3) {
      alert("Partita finita, score " + this.state.score)
    }
    

  }

  render() {

    return (
      <View style={styles.container}>
        {this.loadView()}

        <View>
          <AwesomeButton
            type="primary"
            style={styles.button}
            progress
            onPress={next => {
              this.props.navigation.navigate('InsertMarker', { lat: this.state.latitude, long: this.state.longitude, score1: this.state.score, onGoBack: this.refresh })
              next();

            }}
          > Give the Answer
        </AwesomeButton>
        </View>
        

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