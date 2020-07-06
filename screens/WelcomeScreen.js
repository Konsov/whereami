import React, { Component } from 'react';
import { AppRegistry, Alert, Image, View, StyleSheet, Text, Dimensions } from 'react-native';
import AppIntro from 'rn-falcon-app-intro';

const { width, height } = Dimensions.get('window');

export default class NotificationScreen extends Component {


      onSkipBtnHandle = (index) => {
        this.props.navigation.navigate('HomeScreen')
      }
      doneBtnHandle = () => {
        this.props.navigation.navigate('HomeScreen')
      }
      render() {
        return (
          <AppIntro
            onSkipBtnClick={this.onSkipBtnHandle}
            onDoneBtnClick={this.doneBtnHandle}>
            <View style={[styles.slide,{ backgroundColor: '#a4b602' }]}>
                <View style={{
                    position: 'absolute',
                    top: 30,
                    left: width/ 25,
                    width: width,
                    height: height,
                    }} level={20}
                    >
                    <Image style={{ width: width - width/ 6, height: 150 }} source={require('../files/city1.png')} />
                </View>
                <View level={10}><Text style={styles.text1}>Single-player</Text></View>
                <View></View>
                <View level={15}><Text style={styles.text2}>Play in single-player mode by clicking "play" and collect all the hard badges!</Text></View>
            </View>
            <View style={[styles.slide, { backgroundColor: '#f4a315' }]}>
                <View style={{
                    position: 'absolute',
                    top: 30,
                    left: width/ 25,
                    width: width,
                    height: height,
                    }} level={20}
                    >
                    <Image style={{ width: width - width/ 6, height: 150 }} source={require('../files/city2.png')} />
                </View>
                <View level={-10}><Text style={styles.text1}>Multi-player</Text></View>
                <View level={5}><Text style={styles.text2}>Find random people to play with by clicking "online" in you home page</Text></View>
            </View>
            <View style={[styles.slide,{ backgroundColor: '#01354b' }]}>
                <View style={{
                    position: 'absolute',
                    top: 30,
                    left: width/ 100,
                    width: width,
                    height: height,
                    right: width/ 25,
                    }} level={20}
                    >
                    <Image style={{ width: width - width/ 100, height: 150 }} source={require('../files/city3.png')} />
                </View>
                <View level={8}><Text style={styles.text1}>Play with friend</Text></View>
                <View level={0}><Text style={styles.text2}>Add your friend and play with them to see who is the best</Text></View>            
            </View>
        </AppIntro>
        );
      }
}

const styles = StyleSheet.create({
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
      padding: 15,
    },
    text1: {
      color: '#fff',
      fontSize: 50,
      fontWeight: 'bold',
    },
    text2: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop:height/6,
        textAlign:"justify"
      }
  });

