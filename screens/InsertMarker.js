import React, { Component } from 'react';

import {
    StyleSheet,
    View, Dimensions,
    BackHandler,Modal,Text
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker, ProviderPropType, Polyline } from 'react-native-maps';
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick";
import firebase from '../services/firebase';
import CountDown from 'react-native-countdown-component'

const { width, height } = Dimensions.get('window');
const LATITUDE = 45.742972;
const LONGITUDE = 9.188209;
const LATITUDE_DELTA = 50;
const LONGITUDE_DELTA = 50;

export default class InsertMarker extends Component {

    state = {
        distance: 0,
        roundFinished: false,
        showingAnswerMarker: false,
        marker: { "latitude": 45.742972, "longitude": 9.188209 },
        score: 0,
        timerID: null,
        oppoLat: -1,
        oppoLon: -1,
        myStatus: 'not ready',
        oppoStatus: 'not ready',
        modalVisible1: false,
        modalVisible2: false,
        tempScore: 0
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {            
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    calculateScore() {

        var lat1 = this.state.marker.latitude
        var lon1 = this.state.marker.longitude

        var lat2 = this.props.navigation.getParam('lat');
        var lon2 = this.props.navigation.getParam('long');

        var R = 6371e3; // metres
        var φ1 = lat1 * Math.PI / 180;
        var φ2 = lat2 * Math.PI / 180;
        var Δφ = (lat2 - lat1) * Math.PI / 180;
        var Δλ = (lon2 - lon1) * Math.PI / 180;

        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var distance = Math.round((R * c) / 1000);

        var tempScore = (20000 - distance)
        var score = tempScore + this.props.navigation.getParam('score')
        
        console.log('punti round prima: ' + this.props.navigation.getParam('score'))
        console.log('punti round corrente: ' + tempScore)
        console.log('punti totali: ' + score)
        console.log(distance)
        this.setState({
            score: score,
            distance: distance,
            tempScore: tempScore
        })
        this.getAnswer()
    }



    getAnswer() {
        if (this.props.navigation.getParam('round') == 6){
            this.setState({
                modalVisible1: true
            })
        } else {
            this.setState({
                 modalVisible2: true
            })
        }      
        
        console.log(this.props.navigation.getParam('lat'),this.props.navigation.getParam('long'))

        var timerID = this.props.navigation.getParam('timerID') + 'a'
        
        this.setState({
            showingAnswerMarker: true,
            roundFinished: true,
            myStatus: 'ready',
            timerID: timerID
        })
        console.log(this.state.myStatus)
        
        if(this.props.navigation.getParam('type') == 'multiplayer'){

            this.getOpponentCoordinate()
        }

        firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).child(this.props.navigation.getParam('player')).update({ score: this.state.score, answer: this.state.marker})
    
    }

    renderGetAnswerMarker() {
        if (this.state.myStatus == 'not ready') {
            return null
        } else{
            return (<View style={styles.container}>
                <Marker
                    coordinate={{ latitude: this.props.navigation.getParam('lat'), longitude: this.props.navigation.getParam('long') }}
                />
                <Polyline
                    coordinates={[
                        { latitude: this.props.navigation.getParam('lat'), longitude: this.props.navigation.getParam('long') },
                        { latitude: this.state.marker.latitude, longitude: this.state.marker.longitude }]}
                />

            </View>);
        }
    }

    renderGetOpponentMarker() {
        if (this.state.myStatus == 'ready' && this.state.oppoStatus == 'ready') {
            return (<View style={styles.container}>
                <Marker
                    pinColor={this.setOppoPinColor()}
                    coordinate={{ latitude: this.state.oppoLat, longitude: this.state.oppoLon}}
                />
                <Polyline
                    coordinates={[
                        { latitude: this.state.oppoLat, longitude: this.state.oppoLon },
                        { latitude: this.props.navigation.getParam('lat'), longitude: this.props.navigation.getParam('long') }]}
                />

            </View>)
        } else {
            return null;
        }
    }
    
    getOpponentCoordinate() {
            if(this.props.navigation.getParam('player')== 'player1'){
                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/player2/answer`).once('value').then(function (snapshot){
                
                    var oppoAns = snapshot.toJSON();
                    if(oppoAns != null || this.state.oppoLat == -1){
                        console.log(oppoAns)
                        console.log(oppoAns['latitude'])
                        console.log(oppoAns['longitude'])
                        
                        this.setState({
                            oppoLat: oppoAns['latitude'],
                            oppoLon: oppoAns['longitude'],
                            oppoStatus: 'ready'
                        })
                    }else{
                        setTimeout(() => {this.getOpponentCoordinate(), console.log('oppo not answerd yet') }, 5000) 
                    }                
                }.bind(this));
            }else if(this.props.navigation.getParam('player')== 'player2'){

                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/player1/answer`).once('value').then(function (snapshot){
                
                    var oppoAns = snapshot.toJSON();
                    if(oppoAns != null){
                        console.log(oppoAns)
                        console.log(oppoAns['latitude'])
                        console.log(oppoAns['longitude'])
                        
                        this.setState({
                            oppoLat: oppoAns['latitude'],
                            oppoLon: oppoAns['longitude'],
                            oppoStatus: 'ready'
                        })
                    }else{
                        setTimeout(() => {this.getOpponentCoordinate(), console.log('oppo not answerd yet') }, 5000)
                    }
                }.bind(this));
            }
    }

    
    goToNextRound(){
        this.setState({
            modalVisible2: false,
            myStatus: 'not ready',
            oppoLat: -1
          })
        console.log(this.state.myStatus)
        this.props.navigation.navigate('PlayScreen', { score: this.state.score, timerID: this.state.timerID })  
    }

    renderButton() {
        if (!this.state.roundFinished){
            return (
              <AwesomeButtonRick
              onPress={() => this.calculateScore()}
              type="anchor"
              style={styles.button}
            >MAKE THE GUESS
            </AwesomeButtonRick>);
        }


    }

    setMyPinColor() {
        if (this.props.navigation.getParam('player') == 'player1') {
            return 'gold'
        }else if(this.props.navigation.getParam('player') == 'player2'){
            return 'blue'
        }
    }

    setOppoPinColor(){
        if (this.props.navigation.getParam('player') == 'player1') {
            return 'blue'
        }else if(this.props.navigation.getParam('player') == 'player2'){
            return 'gold'
        }
    }

    render() {

        return (
            <View style={styles.container}>  
            <Modal
            testID={'modal1'}
            visible={this.state.modalVisible1}
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
                <Text style={styles.contentTitle}>Game finished with a score of</Text>
                <Text style={styles.contentTitle}>{this.state.score}</Text>
                
                    <AwesomeButtonRick
                    onPress={() => {firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).update({ finished: true })
                            this.props.navigation.navigate('AppStack'), this.setState({
                                modalVisible1: false
                            })}}
                    type="anchor"
                    style={{left:5, alignItems:"center"}}
                    >END GAME
                    </AwesomeButtonRick>
                </View>
                
            </View>
          </Modal>
          
          <Modal
            testID={'modal2'}
            visible={this.state.modalVisible2}
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
                <Text style={styles.contentTitle}>Score previous round {this.props.navigation.getParam('score')}</Text>
                <Text style={styles.contentTitle}>Score of this round {this.state.tempScore}</Text>
                <Text style={styles.contentTitle}>Total score {this.state.score}</Text>
                
                    <AwesomeButtonRick
                    onPress={() => {this.goToNextRound()}}
                    type="anchor"
                    style={{left:5, alignItems:"center"}}
                    >NEXT ROUND
                    </AwesomeButtonRick>
                </View>
                
            </View>
          </Modal>
                <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    initialRegion={{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    onPress={(e) => {
                        if (!this.state.showingAnswerMarker)
                            this.setState({
                                marker: e.nativeEvent.coordinate
                            })
                    }}>{this.state.marker && <Marker pinColor={this.setMyPinColor()} coordinate={this.state.marker} />}
                    {this.renderGetOpponentMarker()}
                    {this.renderGetAnswerMarker()}
                    <Marker pinColor={this.setMyPinColor()} coordinate={this.state.marker} />

                </MapView>


                {this.renderButton()}



            </View>
        );

    }

}

InsertMarker.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    button: {
        left: (width / 2) - 75,
        top: height - 100,
        width : 150
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        marginTop: height / 9,
        marginBottom: height / 1.4
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
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
      }
});