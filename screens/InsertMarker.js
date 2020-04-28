import React, { Component } from 'react';

import {
    StyleSheet,
    View, Dimensions,
    BackHandler, TouchableHighlight,Image
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker, ProviderPropType, Polyline } from 'react-native-maps';
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick";
import firebase from '../services/firebase';
import CountDown from 'react-native-countdown-component'

const { width, height } = Dimensions.get('window');
const LATITUDE = 47.275904;
const LONGITUDE = -25.705134;
const LATITUDE_DELTA = 50;
const LONGITUDE_DELTA = 50;

export default class InsertMarker extends Component {

    state = {
        distance: 0,
        roundFinished: false,
        showingAnswerMarker: false,
        marker: { "latitude": 45.742972, "longitude": 9.188209 },
        score: 0
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
            distance: distance
        })
    }



    getAnswer() {
        this.calculateScore()
        alert('Hai sbagliato di: ' + this.state.distance + 'km \n sei a: ' + this.state.score + ' punti')
        this.setState({
            showingAnswerMarker: true,
            roundFinished: true
        })
        firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).child(this.props.navigation.getParam('player')).update({ score: this.state.score })
    }

    renderGetAnswerMarker() {
        if (!this.state.showingAnswerMarker) {
            return null
        } else {
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



    renderButton() {
        if (this.state.roundFinished) {
            return (
            <AwesomeButtonRick
            onPress={() => {
                var nRound = this.props.navigation.getParam('round')
                if (nRound < 6) {
                    this.props.navigation.navigate('PlayScreen', { score: this.state.score })
                } else {
                    firebase.database().ref('Games/').child(this.props.navigation.getParam('gameID')).update({ finished: true })
                    this.props.navigation.navigate('AppStack')
                }
            }
            }
              type="anchor"
              style={styles.button}
            >NEXT ROUND
            </AwesomeButtonRick>);
        } else {
            return (
              <AwesomeButtonRick
              onPress={() => this.getAnswer()}
              type="anchor"
              style={styles.button}
            >MAKE THE GUESS
            </AwesomeButtonRick>);
        }



    }

    setPinColor() {
        if (this.props.navigation.getParam('player') == 'player1') {
            return 'yellow'
        }
    }

    render() {

        return (
            <View style={styles.container}>


                <CountDown
                    size={15}
                    style={styles.timer}
                    until={45}
                    onFinish={() => alert('Finished')}
                    digitStyle={{ backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625' }}
                    digitTxtStyle={{ color: '#1CC625' }}
                    timeToShow={['S']}
                />


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
                    }}>{this.state.marker && <Marker pinColor={this.setPinColor()} coordinate={this.state.marker} />}

                    {this.renderGetAnswerMarker()}

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
    timer: {
        position: 'absolute',
        left: 100,
        top: 20
    }
});