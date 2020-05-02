import React, { Component } from 'react';

import {
  StyleSheet,
  View, Dimensions, BackHandler, Modal,TouchableHighlight,Image, Text
} from 'react-native';
import StreetView from 'react-native-streetview';
import firebase from '../services/firebase';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';

import { PacmanIndicator } from 'react-native-indicators';

const { width, height } = Dimensions.get('window');

export default class PlayScreen extends Component {

  state = {
    player: '',
    gameID: '',
    loadingCoordinate: false,
    preclatitude: 0,
    preclongitude: 0,
    latitude: 0,
    longitude: 0,
    round: 1,
    started: false,
    modalVisible: false
  }

  componentDidMount() {
    console.log("qui")
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.setState({
        modalVisible:true
      })
      return true;
    });
    this.IsNumberTwo();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  componentDidUpdate() {
    if (!this.state.started) {
      setTimeout(() => { this.IsNumberTwo(), console.log("wait") }, 5000);
    } else if (!this.state.loadingCoordinate && this.state.round < 6) {
      this.loadCoordinate();
    }
  }

  loadCoordinate() {
    const user = firebase.auth().currentUser
    firebase.database().ref('/Games').orderByChild(`${this.state.player}/user`).equalTo(`${user.uid}`).once('value').then(function (snapshot) {
      var game = snapshot.toJSON()
      for (var id in game) {
        if (game[id]['coordinates'] == null || game[id]['coordinates']['latitude'] == this.state.preclatitude) {
          this.setState({ loadingCoordinate: false })
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
        this.setState({
          player: 'player2',
          gameID: gameID,
          started: true
        })
      } else {
        this.IsNumberOne();
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
          gameID: gameID,
          started: true
        })
      } else {
        this.setState({
          started: false
        })
      }
    }.bind(this))
  }

  goToMarker() {
    if (this.state.player == 'player1') {
      firebase.database().ref('Games/').child(`${this.state.gameID}`).update(
        {
          round: this.state.round + 1
        }
      )
    }

    if (this.props.navigation.getParam('score') == null) {
      var score = 0
    } else {
      var score = this.props.navigation.getParam('score')
    }
    this.props.navigation.navigate('InsertMarker', { lat: this.state.latitude, long: this.state.longitude, round: this.state.round + 1, score: score, gameID: this.state.gameID, player: this.state.player })

    this.setState({
      round: this.state.round + 1,
      loadingCoordinate: false,
      preclatitude: this.state.latitude,
      preclongitude: this.state.longitude
    })
  }

  renderView() {

    if (this.state.player == '' || this.state.loadingCoordinate == false) {
      return (
          <PacmanIndicator size={100} />)
    } else {
      console.log("entra")
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
              stretch = {true}
              style={styles.button1}
            >GIVE ANSWER
            </AwesomeButtonRick>
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
                      onPress={() => {this.setState({ modalVisible:false}), this.props.navigation.navigate("HomeScreen"),console.log("quiqui")}}
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
    bottom: 0,
  },
  button1: {
    alignSelf:"flex-end",
    position: 'absolute',
    top: 20,
    left: width - 170,
    right: 100,
    zIndex: 2,
    width: 150,
    height: 55

  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height / 3,
    marginBottom: height / 3
  },

  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },

  timer: {
    position: 'absolute',
    left: 100,
    top: 1000
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
    left:width/6
  },
  buttone: {
    flex:1,
    position: 'relative',
    width:40,
    height:40,
    left: width / 12

  }
});