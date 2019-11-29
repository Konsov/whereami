import React, { Component } from 'react';

import {
  StyleSheet,
  View, Dimensions
} from 'react-native';
import StreetView from 'react-native-streetview';
import firebase from '../services/firebase';

import CountdownCircle from 'react-native-countdown-circle';
var turf = require('@turf/turf');
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

const { width, height } = Dimensions.get('window');

export default class PlayScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      round: 1,
      score: 0,
      player: 0,
      loadingCoordinate: false,
      latitude: 0,
      longitude: 0
    };
  }

  loadView() {
    if (!this.state.loadingCoordinate) {
      this.loadCoordinate();
      return <ActivityIndicator />;
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
  loadCoordinate() {
    var user = firebase.auth().currentUser;
    firebase.database().ref('/Games').orderByChild('player2').equalTo(user.uid).once('value').then(function(snapshot) {
    var game = snapshot.toJSON()
      for (var id in game) {
        var x = game[id]['coordinates']['latitude'];
        var y = game[id]['coordinates']['longitude'];
      }
      console.log(x);
      console.log(y);
      console.log(this.state.loadingCoordinate)
      this.setState({
        latitude:x,
        longitude:y,
        loadingCoordinate:true
      })
      console.log(this.state.loadingCoordinate)
      console.log(this.state.latitude)
    }.bind(this)).then(()=> this.loadView());

}

  refresh = (data) => {
    this.setState({
      round: this.state.round + 1,
      score: data,
    })
  }
  componentDidUpdate() {
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
              this.props.navigation.navigate('InsertMarker', { lat: y, long: x, score1: this.state.score, onGoBack: this.refresh })
              next();

            }}
          > Give the Answer
        </AwesomeButton>
        </View>
        <View >
          <CountdownCircle
            style={styles.timer}
            seconds={50}
            radius={30}
            borderWidth={8}
            color="#ff003f"
            bgColor="#fff"
            textStyle={{ fontSize: 20 }}
            onTimeElapsed={() => console.log('Elapsed!')}
          />
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