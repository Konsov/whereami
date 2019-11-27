import React, { Component } from 'react';

import {
    StyleSheet,
    View, Dimensions
} from 'react-native';
import MapView from 'react-native-maps';
import { Marker, ProviderPropType } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 47.275904;
const LONGITUDE = -25.705134;
const LATITUDE_DELTA = 100;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function log(eventName, e) {
    console.log(eventName, e.nativeEvent);
  }
  

export default class InsertMarker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            a: {
                latitude: LATITUDE + SPACE,
                longitude: LONGITUDE + SPACE,
            },
        };
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
                        onSelect={e => log('onSelect', e)}
                        onDrag={e => log('onDrag', e)}
                        onDragStart={e => log('onDragStart', e)}
                        onDragEnd={e => log('onDragEnd', e)}
                        onPress={e => log('onPress', e)}
                        draggable
                    >
                    </Marker>
                </MapView>
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
      }
});