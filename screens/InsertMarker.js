import React, { Component } from 'react';

import {
    StyleSheet,
    View, Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker, ProviderPropType } from 'react-native-maps';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

const { width, height } = Dimensions.get('window');
const LATITUDE = 47.275904;
const LONGITUDE = -25.705134;
const LATITUDE_DELTA = 50;
const LONGITUDE_DELTA = 50;
const SPACE = 0.01;


export default class InsertMarker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            a: {
                latitude: LATITUDE - SPACE,
                longitude: LONGITUDE - SPACE,
                distance: 0
            },
        };
    }

    calculateDistance(e) {
        var lat1 = e.nativeEvent.coordinate.latitude;
        var lon1 = e.nativeEvent.coordinate.longitude;
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

        var d = (R * c) / 1000;

        this.setState({ distance: d })
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
                >
                    <Marker
                        coordinate={this.state.a}
                        onDragEnd={e => this.calculateDistance(e)}

                        draggable
                    >
                    </Marker>
                </MapView>

                <AwesomeButton
                    type="primary"
                    style={styles.button}
                    progress
                    onPress={next => {
                        var x = Math.round(this.state.distance) + this.props.navigation.getParam('score1')

                        this.props.navigation.state.params.onGoBack(x);
                        this.props.navigation.goBack();
                        next();

                    }}
                > Make the Guess
                </AwesomeButton>
               



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