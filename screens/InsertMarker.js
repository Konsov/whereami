import React, { Component } from 'react';

import {
    StyleSheet,TouchableHighlight,
    View, Dimensions,
    BackHandler,Modal,Text
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker, ProviderPropType, Polyline } from 'react-native-maps';
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick";
import firebase from '../services/firebase';
import CountDown from 'react-native-countdown-component'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LATITUDE = 45.742972;
const LONGITUDE = 9.188209;
const LATITUDE_DELTA = 50;
const LONGITUDE_DELTA = 50;

export default class InsertMarker extends Component {

    state = {
        distance: 0,
        counterNextRound: 10,
        marker: { "latitude": 45.742972, "longitude": 9.188209 },
        score: 0,
        oppoLat: -1,
        oppoLon: -1,
        answered: false,
        oppoAnswered: false,
        modalVisibleScore: false,
        modalVisibleNextRound: false,
        tempScore: 0,
        oppoRoundScore: 0,
        oppoScore: 0,
        myStatus: false,
        runTimer: true
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
    
        this.setState({
            modalVisibleScore: true,
            runTimer: false,
        })
          
        
        console.log(this.props.navigation.getParam('lat'),this.props.navigation.getParam('long'))
        
        this.setState({
            answered: true
        })

        console.log(this.props.navigation.getParam('player'),' ha risposto? ',this.state.answered)
        
        if(this.props.navigation.getParam('type') == 'multiplayer'){

            console.log('quando do la risposta',this.props.navigation.getParam('round'))
            if(this.props.navigation.getParam('player') == 'player1'){
                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates`).child(`round_${this.props.navigation.getParam('round')}`).update({ player1_answer: {coordinates: this.state.marker, score: this.state.tempScore, ready: false}})
            }else{
                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates`).child(`round_${this.props.navigation.getParam('round')}`).update({ player2_answer: {coordinates: this.state.marker, score: this.state.tempScore, ready: false}})
            }

            this.getOpponentCoordinate()
        }
        
        firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).child(this.props.navigation.getParam('player')).update({ score: this.state.score})
    
    }

    renderGetAnswerMarker() {
        if (!this.state.answered) {
            return null
        } else{
            return (<View>
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
        if (this.state.answered && this.state.oppoAnswered) {
            return (<View>
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

    getOpponentScore(){
        if(this.props.navigation.getParam('player')== 'player1'){
            firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/player2`).once('value').then(function (snapshot){
            
                var oppo = snapshot.toJSON();
                if(oppo != null){
                    
                    this.setState({
                        oppoScore: oppo['score'],
                    })

                }           
            }.bind(this));
        }else if(this.props.navigation.getParam('player')== 'player2'){

            firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/player1`).once('value').then(function (snapshot){
            
                var oppo = snapshot.toJSON();
                if(oppo != null){
                    
                    this.setState({
                        oppoScore: oppo['score'],
                    })

                }         
              
            }.bind(this));
        }
    }
    
    getOpponentCoordinate() {
        console.log("quando prendo le coordinate dell`opponent", this.props.navigation.getParam('round'))
            if(this.props.navigation.getParam('player')== 'player1'){
                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player2_answer`).once('value').then(function (snapshot){
                
                    var oppoAns = snapshot.toJSON();
                    if(oppoAns != null){
                        console.log(oppoAns)
                        console.log(oppoAns['coordinates']['latitude'])
                        console.log(oppoAns['coordinates']['longitude'])
                        
                        this.setState({
                            oppoLat: oppoAns['coordinates']['latitude'],
                            oppoLon: oppoAns['coordinates']['longitude'],
                            oppoRoundScore: oppoAns['score'],
                            oppoAnswered: true
                        })
                        this.getOpponentScore()
                    }else{
                        setTimeout(() => {this.getOpponentCoordinate(), console.log('oppo not answered yet') }, 2000) 
                    }                
                }.bind(this));
            }else if(this.props.navigation.getParam('player')== 'player2'){

                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player1_answer`).once('value').then(function (snapshot){
                
                    var oppoAns = snapshot.toJSON();
                    if(oppoAns != null){
                        console.log(oppoAns)
                        console.log(oppoAns['coordinates']['latitude'])
                        console.log(oppoAns['coordinates']['longitude'])
                        
                        this.setState({
                            oppoLat: oppoAns['coordinates']['latitude'],
                            oppoLon: oppoAns['coordinates']['longitude'],
                            oppoRoundScore: oppoAns['score'],
                            oppoAnswered: true
                        })
                        
                        this.getOpponentScore()
                    }else{
                        setTimeout(() => {this.getOpponentCoordinate(), console.log('oppo not answered yet') }, 2000)
                    }
                }.bind(this));
            }
    }

    getLeaderbordText(){

        var intro
        var outro
       
        if(this.props.navigation.getParam('round')<5){
            intro = <Text>Round: {this.props.navigation.getParam('round')}</Text>
            outro = <Text>{this.state.counterNextRound} secondi al prossimo round</Text>
        
        }else{
            intro = <Text>Final Leaderboard</Text>
            
            if(this.state.score > this.state.oppoScore){
            outro = <View>
                        <Text>YOU WIN</Text>
                        <TouchableHighlight
                            onPress={() => {
                                this.setState({
                                    modalVisibleScore: false
                                })
                            }}
                        ><Text>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
            }else{
                outro = <View>
                <Text>YOU LOSE</Text>
                <TouchableHighlight
                    onPress={() => {
                        this.setState({
                            modalVisibleScore: false
                        })
                    }}
                ><Text>Hide Modal</Text>
                </TouchableHighlight>
            </View>
            }
            
        }
        
        if(this.state.score > this.state.oppoScore){
            return (
                <View>
                    {intro}
                    <Text>1st {this.props.navigation.getParam('username')} {this.state.score}</Text>
                    <Text>2nd {this.props.navigation.getParam('oppoUsername')} { this.state.oppoScore}</Text>
                    {outro}
                </View>)
        }else{
            return (
                <View>
                    {intro}
                    <Text>1st {this.props.navigation.getParam('oppoUsername')} {this.state.oppoScore}</Text>
                    <Text>2nd {this.props.navigation.getParam('username')} {this.state.score}</Text>
                    {outro}
                </View>)
        }
    }
   
    getModalNextRoundRender(){
        return(
        <Modal
            testID={'ModalNextRound'}
            visible={this.state.modalVisibleNextRound}
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
            
            <View>

                {this.getLeaderbordText()}

            </View>
      </Modal>)
    }

    startCounterNextRound(){
        var countdown = 10
        var timer = setInterval(() => {
            countdown = countdown-1
            if(countdown>0){
                this.setState({counterNextRound: countdown})
            }else{
                this.props.navigation.navigate('PlayScreen', { score: this.state.score, timerID: this.props.navigation.getParam('timerID') + 'a',runTimer:true })
                this.setState({
                    answered: false,
                    oppoAnswered: false,
                    myStatus: false,
                    modalVisibleNextRound: false
                })
                clearInterval(timer)
            } 
        }, 1000)
    }
    
    goToNextRound(){
    
        if(this.props.navigation.getParam('type')=='single'){
           
            this.props.navigation.navigate('PlayScreen', { score: this.state.score, timerID: this.props.navigation.getParam('timerID') + 'a', runTimer: true })  
           
            this.setState({
                answered: false
            })
        }else{
            if(this.props.navigation.getParam('player') == 'player1'){
                
            console.log("quando sono pronto", this.props.navigation.getParam('round'))
                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player1_answer`).update({ready: true})
            }else{
                
            console.log("quando sono pronto", this.props.navigation.getParam('round'))
                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player2_answer`).update({ready: true})
            }
            this.setState({
                myStatus: true
            })
            this.getOpponentStatus()
        }
    }

    getOpponentStatus(){
        if(this.props.navigation.getParam('player')== 'player1'){
            firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player2_answer/ready`).once('value').then(function (snapshot){
            
                var oppoStatus = snapshot.toJSON();
                if(oppoStatus != null){

                    console.log("oppostatus",oppoStatus)
                  
                    if(oppoStatus == true){ 
                        this.setState({
                            modalVisibleNextRound: true,
                            answered: false,
                            oppoAnswered: false
                        }) 
                        
                        if(this.props.navigation.getParam('round')<5){
                            this.startCounterNextRound()
                        }

                    }else{
                        setTimeout(() => {this.getOpponentStatus(), console.log('oppo not ready') }, 2000) 
                    }
                }else{
                    console.log('something go wrong')
                }
            }.bind(this));
        }else if(this.props.navigation.getParam('player')== 'player2'){
            firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player1_answer/ready`).once('value').then(function (snapshot){
            
                var oppoStatus = snapshot.toJSON();
                if(oppoStatus != null){
                    console.log("oppostatus",oppoStatus)
                    if(oppoStatus == true){ 
                        this.setState({
                            modalVisibleNextRound: true,
                            answered: false,
                            oppoAnswered: false
                        })   
                        
                        if(this.props.navigation.getParam('round')<5){
                            this.startCounterNextRound()
                        }

                    }else{
                        setTimeout(() => {this.getOpponentStatus(), console.log('oppo not ready') }, 2000) 
                    }
                }else{
                    console.log('something go wrong')
                }
            }.bind(this));
        }
    }

    renderButton() {
        if (!this.state.answered){
            return (
            <AwesomeButtonRick
                onPress={() => this.calculateScore()}
                type="anchor"
                style={styles.button}
                >MAKE THE GUESS
            </AwesomeButtonRick>);
        }else if(((this.state.answered && this.state.oppoAnswered && !this.state.myStatus && this.props.navigation.getParam('type') == 'multiplayer') || (this.state.answered && this.props.navigation.getParam('type') == 'single')) && this.props.navigation.getParam('round')<5){
            return(
            <AwesomeButtonRick
                onPress={() => {this.goToNextRound()}}
                type="anchor"
                style={styles.button}
                >Ready For Next Round
            </AwesomeButtonRick>
            )
        }else if((this.state.answered && !this.state.oppoAnswered && this.props.navigation.getParam('type') == 'multiplayer')  || (this.state.myStatus && this.props.navigation.getParam('round') < 5)){
            return(
                <View>
                    <Text>Waiting Opponent</Text>
                </View>
                )
        }else if(((this.state.answered && this.state.oppoAnswered && !this.state.myStatus && this.props.navigation.getParam('type') == 'multiplayer') || (this.state.answered && this.props.navigation.getParam('type') == 'single') ) && this.props.navigation.getParam('round') == 5){
            return(
                <AwesomeButtonRick
                    onPress={() => {
                        firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).update({ finished: true })
                        this.props.navigation.navigate('AppStack'), this.setState({
                        })}}
                    type="anchor"
                    style={styles.button}
                    >END GAME
                </AwesomeButtonRick>
            )
        }else{
            return null
        }


    }

    getModalScoreRender(){
        return(
        <Modal
            testID={'modalScore'}
            visible={this.state.modalVisibleScore}
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
                {this.getMyScoreRender()}
                <Text>Score of this round {this.state.tempScore}</Text>
                <Text>Total score {this.state.score}</Text>
                <TouchableHighlight
                    onPress={() => {
                        this.setState({
                            modalVisibleScore: false
                        })
                    }}
                >
                <Text>Hide Modal</Text>
                </TouchableHighlight>
        </View>
      </Modal>)
    }

    getOppoScoreRender(){
        if(this.props.navigation.getParam('type') == 'single'){
            return null
        }else{
        <Text>your Opponent do {this.state.oppoScore}</Text>
        }
    }

    getMyScoreRender(){
        if(this.state.distance <= 20000 && this.state.distance > 10000){
            return (<Text>Whaaaat? You shuold study geography bro! You are {this.state.distance}km far!</Text>)
        }else if(this.state.distance <= 10000 && this.state.distance > 5000){
            return (<Text>Nice Try! But you can do better!! You wrong by {this.state.distance}km</Text>)
        }else if(this.state.distance <= 5000 && this.state.distance > 1000){    
            return (<Text>Yeah! Very Close! Only {this.state.distance}km far</Text>)
        }else if(this.state.distance <= 1000 ){
            return (<Text>GREAT!{this.state.distance}km missed, YOU GOTTA THIS BRO </Text>)
        }else{
            console.log("something go wrong with the score")
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

            {this.getModalNextRoundRender()}
            
            {this.getModalScoreRender()}
                    
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
                    
                    <CountDown
                        style={styles.timer}
                        size={windowWidth/15}
                        until = {20}
                        onFinish={() => this.calculateScore()}
                        digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
                        digitTxtStyle={{color: '#1CC625'}}
                        timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                        separatorStyle={{color: '#1CC625'}}
                        timeToShow={['S']}
                        timeLabels={{s: null}}
                        running ={this.state.runTimer}
                    />
            

            </View>
        );

    }

}

InsertMarker.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    button: {
        position: 'absolute',
        top: windowHeight/25,
        right: windowWidth/30
    },
    
    timer: {
        position: 'absolute',
        top: windowHeight/40,
        left: windowWidth/30
    },

    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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