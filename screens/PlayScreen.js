import React, { Component } from 'react';

import {
  StyleSheet,
  View, Dimensions, BackHandler, Modal,TouchableHighlight,Image, Text
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
    type: '',
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
  answerButton: {
    position: 'absolute',
    top: windowHeight/25,
    right: windowWidth/30
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