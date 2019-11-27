import React, { Component } from 'react';

import {
  StyleSheet,
  View, Text, TouchableOpacity,
} from 'react-native';
import StreetView from 'react-native-streetview'
import Icon from 'react-native-vector-icons/Octicons';
import { geometry, point } from '@turf/turf';
var randomPointsOnPolygon = require('random-points-on-polygon');
var turf = require('@turf/turf');

export default class PlayScreen extends Component {

  setLocation(){
    this.props.navigation.navigate('InsertMarker')
  }

  render() {

    const send_button = (
      <Icon.Button name="rocket" backgroundColor="#3b5998" size={20} onPress={() => { this.setLocation() }}>
        <Text style={{ fontFamily: 'Arial', fontSize: 15, color: '#fff' }}>Give the answer</Text>
      </Icon.Button>
    );

    var numberOfPoints = 1;
    var australiaPoly = turf.polygon([[
      [114.4335938, -24.2864945],
      [116.9296990, -34.1660824],
      [129.9375115, -30.9838216],
      [134.4375032, -32.2796030],
      [135.8437532, -33.9862254],
      [137.4082147, -32.7000220],
      [140.5722772, -37.3026713],
      [146.2851678, -37.6512262],
      [149.9765740, -35.3925767],
      [152.8769647, -28.8522143],
      [151.3828240, -24.6971179],
      [147.1640740, -20.8098443],
      [144.7910272, -18.3270360],
      [139.0781365, -18.3270360],
      [133.2773553, -14.1108503],
      [122.7304803, -18.9097468],
      [114.5566522, -23.0909197],
      [114.4335938, -24.2864945],
    ]])

    var points = randomPointsOnPolygon(numberOfPoints, australiaPoly);
    var x = points[0]["geometry"]["coordinates"][0];
    var y = points[0]["geometry"]["coordinates"][1];
    console.log(y, x);
    return (
      <View style={styles.container}>
        <StreetView
          style={styles.streetView}
          allGesturesEnabled={true}
          coordinate={{ latitude: y, longitude: x, radius: 100000 }}
        />

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