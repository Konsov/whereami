import React, { Component } from 'react';

import {
    StyleSheet,
    View, Dimensions,
    Button
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker, ProviderPropType, Polyline } from 'react-native-maps';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";
import firebase from '../services/firebase';

const { width, height } = Dimensions.get('window');
const LATITUDE = 47.275904;
const LONGITUDE = -25.705134;
const LATITUDE_DELTA = 50;
const LONGITUDE_DELTA = 50;
const SPACE = 0.01;


export default class InsertMarker extends Component {

  

        state = {
             a: {
                latitude: LATITUDE - SPACE,
                longitude: LONGITUDE - SPACE
            },
            distance: 0,
            roundFinished: false,
            showingAnswerMarker: false,
            marker: null,
            score: 0
        }
    
    


    calculateScore(e) {
        var lat1 = e.nativeEvent.coordinate.latitude;
        var lon1 = e.nativeEvent.coordinate.longitude;
        this.setState({
            a: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
            },
            marker: e.nativeEvent.coordinate
        })

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

        var tempScore = distance + this.props.navigation.getParam('score')
        console.log('punti round prima: ' + this.props.navigation.getParam('score'))
        console.log('punti round corrente: '  + distance)
        
        this.setState({
            score: tempScore,
            distance: distance
            })
    }



    getAnswer(){
        alert('Hai sbagliato di: ' + this.state.distance + 'km \n sei a: ' + this.state.score + ' punti')    
        this.setState({
            showingAnswerMarker: true,
            roundFinished: true
            })
    }

    renderGetAnswerMarker(){
        if(!this.state.showingAnswerMarker){
            return null
            }else{
                return (<View style={styles.container}>
                        <Marker
                        coordinate={{latitude: this.props.navigation.getParam('lat') , longitude: this.props.navigation.getParam('long')}}
                        />
                        <Polyline
                        coordinates={[
                            { latitude: this.props.navigation.getParam('lat'), longitude: this.props.navigation.getParam('long') },
			                { latitude: this.state.a.latitude, longitude: this.state.a.longitude} ]}
                        />

                        </View>);
                    }
    }

                        

    renderButton(){
        if(this.state.roundFinished){      
            return( <AwesomeButton
                    type="primary"
                    style={styles.button}
                    progress
                    onPress={() => {
                            console.log('score '+ this.state.score)
                            var nRound = this.props.navigation.getParam('round')
                            if(nRound<6){
                                this.props.navigation.navigate('PlayScreen', {score: this.state.score})
                            }else{
                                this.props.navigation.navigate('AppStack')
                            }
                        }
                    }
                > Next Round
                </AwesomeButton>);
        }else{
            return( <AwesomeButton
                    type="primary"
                    style={styles.button}
                    progress
                    onPress={() => this.getAnswer()}
                > Make the Guess
                </AwesomeButton>);
        }



    }
    render() {

        return (
            <View style={styles.container}>
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
                        if(!this.state.showingAnswerMarker)
                            this.calculateScore(e)
                        }}>{this.state.marker && <Marker coordinate={this.state.marker} />}
                     
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
        left: width - 245,
        top: height - 100,
        justifyContent: 'center',
    }
});