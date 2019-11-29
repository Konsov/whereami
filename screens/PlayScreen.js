import React, { Component } from 'react';

import {
  StyleSheet, ActivityIndicator,
  View, Text, TouchableOpacity,
} from 'react-native';
import StreetView from 'react-native-streetview'
import Icon from 'react-native-vector-icons/Octicons';


import firebase from '../services/firebase';

export default class PlayScreen extends Component {

  state = {
    player: '',
    loadingCoordinate: false,
    latitude:0,
    longitude:0
  }

  setLocation(){
    this.props.navigation.navigate('InsertMarker')
  }

  loadView() {
    
    if(this.state.player == ''){
      this.getPlayerNumber();
      return <ActivityIndicator />;
    }else{

    if (!this.state.loadingCoordinate) {
      this.loadCoordinate();
      return <ActivityIndicator />;
    } else {
      return (
        <StreetView
          style={styles.streetView}
          allGesturesEnabled={true}
          coordinate={{latitude: this.state.latitude, longitude: this.state.longitude, radius: 100000 }}
        />
      );
    }
  }
  }

  getPlayerNumber(){
      const user = firebase.auth().currentUser
      
      var ref = firebase.database().ref('/Games');
      ref.orderByChild('player1').equalTo(`${user.uid}`).once('value').then(function(snapshot){
        
        if(snapshot.exists()){
          this.setState({player: 'player1'})
          console.log(this.state.player)
          return this.state.player
        }else{
          return this.state.player
        }

      }.bind(this)).then(function(data){
          if(data == 1){
            return this.setState.player
          }else{
            ref.orderByChild('player2').equalTo(`${user.uid}`).once('value').then(function(snapshot){
            
              if(snapshot.exists()){
                this.setState({player: 'player2'})
                console.log(this.state.player)
                return this.state.player
              }else{
                return this.state.player
              }
            }.bind(this))
          }
      }.bind(this))      
  }


  
  loadCoordinate() {    

      const user = firebase.auth().currentUser


      firebase.database().ref('/Games').orderByChild(`${this.state.player}`).equalTo(`${user.uid}`).once('value').then(function(snapshot) {
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
      }.bind(this));

  }


  render() {

    const send_button = (
      <Icon.Button name="rocket" backgroundColor="#3b5998" size={20} onPress={() => { this.setLocation() }}>
        <Text style={{ fontFamily: 'Arial', fontSize: 15, color: '#fff' }}>Give the answer</Text>
      </Icon.Button>
    );
      

    return (
      <View style={styles.container}>
       
       {this.loadView()}

        <View style={styles.button}>
          <TouchableOpacity>
            {send_button}
          </TouchableOpacity>
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
    left: 250,
    height: 20,
    width: 100,
    right: 100,
    zIndex: 2
  }
});