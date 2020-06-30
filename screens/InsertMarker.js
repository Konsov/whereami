import React, { Component } from 'react';

import {
    StyleSheet,
    View, Dimensions,
    BackHandler,Text, ImageBackground, Image
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker, ProviderPropType, Polyline } from 'react-native-maps';
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick";
import firebase from '../services/firebase';
import CountDown from 'react-native-countdown-component';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-vector-icons/MaterialIcons';

import { BarIndicator } from 'react-native-indicators';

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
        runTimer: true,
        endModal:false
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

        var tempScore = (20000 - distance) / 10

        tempScore = Math.trunc( tempScore )

        
        
        var score = tempScore + this.props.navigation.getParam('score')
        console.log(this.props.navigation.getParam('player'))
        console.log("distance"+ distance)
        console.log("score"+ score)
        console.log("tempscore"+ score)
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
          
        
  
        this.setState({
            answered: true
        })

        
        if(this.props.navigation.getParam('type') == 'multiplayer'){

            console.log(this.state.tempScore)
            if(this.props.navigation.getParam('player') == 'player1'){
                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates`).child(`round_${this.props.navigation.getParam('round')}`).update({ player1_answer: {coordinates: this.state.marker, score: this.state.tempScore, ready: false}})
            }else{
                firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates`).child(`round_${this.props.navigation.getParam('round')}`).update({ player2_answer: {coordinates: this.state.marker, score: this.state.tempScore, ready: false}})
            }

            this.getOpponentCoordinate()
        }
        
        if (this.state.tempScore >= 19900){
            firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).child(this.props.navigation.getParam('player')).child('badge').update({center:true})
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

        if(this.props.navigation.getParam('player')== 'player1'){
            firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player2_answer`).once('value').then(function (snapshot){
            
                var oppoAns = snapshot.toJSON();
                if(oppoAns != null){

                    
                    this.setState({
                        oppoLat: oppoAns['coordinates']['latitude'],
                        oppoLon: oppoAns['coordinates']['longitude'],
                        oppoRoundScore: oppoAns['score'],
                        oppoAnswered: true
                    })
                    this.getOpponentScore()
                }else {
                    firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}`).once('value').then(snap => {
                        if (!snap.exists()){

                        } else {
                            setTimeout(() => {this.getOpponentCoordinate(), console.log('oppo not answered yet') }, 2000)
                        }
                    })
                }                
            }.bind(this));
        }else if(this.props.navigation.getParam('player')== 'player2'){

            firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player1_answer`).once('value').then(function (snapshot){

                var oppoAns = snapshot.toJSON();
                if(oppoAns != null){

                    this.setState({
                        oppoLat: oppoAns['coordinates']['latitude'],
                        oppoLon: oppoAns['coordinates']['longitude'],
                        oppoRoundScore: oppoAns['score'],
                        oppoAnswered: true
                    })

                    this.getOpponentScore()
                } else {
                    firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}`).once('value').then(snap => {
                        if (!snap.exists()){

                        } else {
                            setTimeout(() => {this.getOpponentCoordinate(), console.log('oppo not answered yet') }, 2000)
                        }
                    })
                } 
            }.bind(this));
        }
    }    

    renderLeaderbordText(){

        var intro
        var outro
       
        if(this.props.navigation.getParam('round')<5){
            intro = <View><Text style={styles.title}>Leaderboard</Text></View>
            outro = <View><Text style={styles.timerText}>{this.state.counterNextRound} secondi al prossimo round</Text></View>
        
        }else{
            intro = <View><Text style={styles.title}>Final Leaderboard</Text></View>
            const user = firebase.auth().currentUser;
            if(this.state.score > this.state.oppoScore){
                outro = <View style={{alignItems:'center'}}>

                            <Text style={styles.winTitle}>YOU WIN</Text>
                            <AwesomeButtonRick
                            onPress={() => {
                                this.setState({endModal:true});
                                setTimeout(() => {this.props.navigation.navigate('AppStack')}, 3000);
                                firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).once("value", snapshot => {                                    
                                    if (snapshot.exists()){
                                       firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).update({ finished: true, winner: user.uid})
                                    }
                                 });}}
                            type="anchor"
                            >Go To Home
                            </AwesomeButtonRick>
                        </View>
            }else{
                outro = <View style={{alignItems:'center'}}>
                            <Text style={styles.loseTitle}>YOU LOSE</Text>
                            <AwesomeButtonRick
                                onPress={() => {
                                    this.props.navigation.navigate('AppStack')}}
                                type="anchor"
                                >Go To Home
                            </AwesomeButtonRick>
                        </View>
            }
            
        }
        
        if(this.state.score > this.state.oppoScore){
            return (
                <View>
                    {intro}
                    <View style={styles.leaderboardRow}> 
                    <Image style={styles.circle}
                                source={{ uri:this.props.navigation.getParam('userpic') }} />
                        <View>
                            <Text style={styles.textLeaderboard}>{this.props.navigation.getParam('username')} {this.state.score}</Text>
                        </View>
                            {/* <Image 
                                source={{ uri:this.props.navigation.getParam('userpic')}} 
                                style={{width: windowWidth/10, height: windowWidth/10, borderRadius: 40/ 2}} 
                            /> */}

                            {/* <Text style={styles.content}>{this.props.navigation.getParam('username')} {this.state.score}</Text> */}
                    </View>
                    <View style={styles.leaderboardRow}> 
                    <Image style={styles.circle}
                                source={{ uri:this.props.navigation.getParam('oppoUserpic') }} />
                        <View>
                            <Text style={styles.textLeaderboard}>{this.props.navigation.getParam('oppoUsername')} {this.state.oppoScore}</Text>
                        </View>
                    </View>
                    {/* <Icon name='looks-two' type='material' color='#5bbd3a'/> */}
{/*                    
                        <Image 
                            source={{ uri:this.props.navigation.getParam('oppoUserpic')}} 
                            style={{width: windowWidth/10, height: windowWidth/10, borderRadius: 40/ 2}} 
                        />
                        <Text style={styles.content}>{this.props.navigation.getParam('oppoUsername')} { this.state.oppoScore}</Text> */}
                  
                    {outro}
                </View>)
        }else{
            return (
                <View>
                    {intro}
                    <View style={styles.leaderboardRow}> 
                    <Image style={styles.circle}
                                source={{ uri:this.props.navigation.getParam('oppoUserpic') }} />
                        <View>
                            <Text style={styles.textLeaderboard}>{this.props.navigation.getParam('oppoUsername')} {this.state.oppoScore}</Text>
                        </View> 
                    </View>
                    <View style={styles.leaderboardRow}> 
                    <Image style={styles.circle}
                                source={{ uri:this.props.navigation.getParam('userpic') }} />
                        <View>
                            <Text style={styles.textLeaderboard}>{this.props.navigation.getParam('username')} {this.state.score}</Text>
                        </View>
                    </View>
                    {outro}
                </View>)
        }
    }
   
    renderModalNextRound(){
        return(
        <Modal
            testID={'ModalNextRound'}
            isVisible={this.state.modalVisibleNextRound}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            transparent = {true}
            animationType = "slide"
            hasBackDrop={true}>
            <View style={styles.modalView}>

                {this.renderLeaderbordText()}

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

    endModal(){
        return(
            <Modal
                testID={'modalExit'}
                isVisible={this.state.endModal}
                coverScreen = {true}
                hasBackDrop={false}>
                <View style={styles.endView}>     
                    <View style={{ marginTop:windowHeight/3.5, height: windowHeight/3.5}}>
                        <Image source={require('../files/logo2.png')} style={{width: '100%', height: '100%',resizeMode: 'stretch'}}/>
                        <BarIndicator style={{marginTop:windowHeight/23}} size={40} />
                    </View>
                </View>
          </Modal>)
    }
    
    goToNextRound(){
        
            if(this.props.navigation.getParam('type')=='single'){

                if(this.props.navigation.getParam('round')<5){
                    this.props.navigation.navigate('PlayScreen', { score: this.state.score, timerID: this.props.navigation.getParam('timerID') + 'a', runTimer: true })  
            
                this.setState({
                    answered: false
                })
                }else{
                    firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).update({ finished: true })
                    this.setState({endModal:true})
                    setTimeout(() => {this.props.navigation.navigate('AppStack')}, 3000);
                }
            }else{
                if(this.props.navigation.getParam('player') == 'player1'){
                    
                    firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player1_answer`).update({ready: true})
                }else{
                    
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
                    firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}`).once('value').then(snap => {
                        if (!snap.exists()){

                        } else {
                            console.log("something went wrong")
                        }
                    })
                }
            }.bind(this));
        }else if(this.props.navigation.getParam('player')== 'player2'){
            firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}/roundCoordinates/round_${this.props.navigation.getParam('round')}/player1_answer/ready`).once('value').then(function (snapshot){

                var oppoStatus = snapshot.toJSON();
                if(oppoStatus != null){
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
                    firebase.database().ref(`Games/${this.props.navigation.getParam('gameID')}`).once('value').then(snap => {
                        if (!snap.exists()){

                        } else {
                            console.log("something went wrong")
                        }
                    })
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
                <View style={styles.button}><BarIndicator color='#3f8228' size={35}/></View>
                )
        }else if(((this.state.answered && this.state.oppoAnswered && !this.state.myStatus && this.props.navigation.getParam('type') == 'multiplayer') || (this.state.answered && this.props.navigation.getParam('type') == 'single') ) && this.props.navigation.getParam('round') == 5){
            return(
                <AwesomeButtonRick
                    onPress={() => {this.goToNextRound()}}
                    type="anchor"
                    style={styles.button}
                    >END GAME
                </AwesomeButtonRick>
            )
        }else{
            return null
        }


    }

    renderModalScore(){
        var msg
        var finishMsg = <Text style={styles.title}>Round { this.props.navigation.getParam('round') } </Text>
        if(this.state.distance <= 20000 && this.state.distance > 10000){
            msg = <Text style={styles.content}>Whaaaat? You shuold study geography bro! You are {this.state.distance}km far!</Text>
        }else if(this.state.distance <= 10000 && this.state.distance > 5000){
            msg = <Text style={styles.content}>Nice Try! But you can do better!! You wrong by {this.state.distance}km</Text>
        }else if(this.state.distance <= 5000 && this.state.distance > 1000){    
            msg= <Text style={styles.content}>Yeah! Very Close! Only {this.state.distance}km far</Text>
        }else if(this.state.distance <= 1000 ){
            msg= <Text style={styles.content}>GREAT!{this.state.distance}km missed, YOU GOTTA THIS BRO </Text>
        }else{
            msg = <Text style={styles.content}>Errore</Text>
        }

        if(this.props.navigation.getParam('round')==5){
            finishMsg=<Text style={styles.title}>FINISH</Text>
        }


        return(
        <Modal
            testID={'modalScore'}
            isVisible={this.state.modalVisibleScore}
            backdropColor="#B4B3DB"
            backdropOpacity={0.8}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={600}
            animationOutTiming={600}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
            transparent = {true}
            animationType = "slide"
            hasBackDrop={true}
            onBackdropPress={() => this.setState({modalVisibleScore:false})}>
        <View style={styles.modalView}>     
                {finishMsg}
                {msg}
                <View style={styles.score}>
                    <Text style={styles.scoretext}>Score of this Round <Text style={styles.scorepoint}>{this.state.tempScore}</Text></Text>
                    <Text style={styles.scoretext}>Total Score <Text style={styles.scorepoint}>{this.state.score}</Text></Text>
                </View>
        </View>
      </Modal>)
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

            {this.renderModalNextRound()}
            {this.endModal()}
            {this.renderModalScore()}
                    
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
                            if (!this.state.showingAnswerMarker && !this.state.answered)
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
        borderColor: "#5bbd3a",
        borderWidth: 4,
        borderRadius: 20,
        paddingHorizontal: 35,
        paddingVertical:30,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },

    title:{
        fontSize: 29,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom:25,
    },

    winTitle:{
        fontSize: 27,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom:25,
        marginTop:10,
        color:'green'
    },

    endView: {
        position: 'absolute',
        backgroundColor: "white",
        width: windowWidth,
        height: windowHeight,
        marginLeft:-19.7,
    },    

    timerText:{
        fontSize: 18,
        textAlign: "center",
        marginTop:25,
    },

    loseTitle:{
        fontSize: 27,
        textAlign: "center",
        fontWeight: 'bold',
        marginTop:10,
        marginBottom:25, 
        color:'red'
    },

    textLeaderboard:{
        fontSize: 20,
        textAlignVertical: "center",
        flex:1,
        marginLeft:10
    },

    content:{
        fontSize: 18,
        textAlign: "center",
    },
    score:{
        alignItems: "center",
        marginTop: 20,
    },
    scoretext:{
        fontSize: 19
    },
    scorepoint:{
        fontSize: 19,
        fontWeight: 'bold',

    },
    circle: {
        width: windowHeight/10,
        height: windowHeight/10,
        borderRadius: 50/2,
        borderColor:'#5bbd3a',
        borderWidth:4,
    },
    leaderboardRow:{
        flexDirection:'row',
        marginBottom:10
    },
});