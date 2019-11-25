import React, { Component } from 'react';

import {
	StyleSheet,
	View, Text, TouchableOpacity,
} from 'react-native';
import StreetView from 'react-native-streetview'
import Icon from 'react-native-vector-icons/Octicons';


const location = {

	'latitude': 37.809473,
	'longitude': -122.476140,
	'radius': 50,

}

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

export default class PlayScreen extends Component {
	_isMounted = false;
	constructor(props) {
	  super(props);
	  this.state = {
		'latitude': 37.809473,
		'longitude': -122.476140,
		'radius': 50,
	  };
	}
	
	

	componentDidMount() {
		this._isMounted = true;
		var lat = (Math.random() * 90) - 90;
		var lon = (Math.random() * 180) - 180;
		if (this._isMounted){
			this.setState({				
				latitude: lat,
				longitude: lon
			})
			console.log(this.state.latitude)
		}	
		console.log(this.state.latitude)
		console.log(this.state.longitude)	
	}
	componentWillUnmount() {
		this._isMounted = false;
	}

    
	render() {
		const send_button = (
			<Icon.Button name="rocket" backgroundColor="#3b5998" size={20} onPress={() => { alert("Ciao") }}>
				<Text style={{ fontFamily: 'Arial', fontSize: 15, color: '#fff' }}>Give the answer</Text>
			</Icon.Button>
		);
		var x1 = 12.108426;
		var x2 = 15.789722;
		var y1= 40.732778;
		var y2 = 45.633611;
		
		var x =Math.random()*(x2-x1)+x1;
		var y=Math.random()*(y2-y1)+y1;
		console.log(y,x);	
		return (
			<View style={styles.container}>
				<StreetView
					style={styles.streetView}
					allGesturesEnabled={true}
					coordinate={{latitude:y,longitude:x,radius:100000}}
					

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