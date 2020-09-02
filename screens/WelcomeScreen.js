import React, { Component } from 'react';
import { AppRegistry, Alert, Image, View, StyleSheet, Text, Dimensions, Button } from 'react-native';
import AppIntro from 'rn-falcon-app-intro';

const windowsWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;

export default class NotificationScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      keyUpdate: 0
    };
  }



  nextBtnHandle = (index) => {
    // Alert.alert('Next');
    // console.warn(index);
  }
  onSlideChangeHandle = (index, total) => {
    // console.warn(index, total);
  }

  onSkipBtnHandle = (index) => {
    this.props.navigation.navigate('HomeScreen')
  }
  doneBtnHandle = () => {
    this.props.navigation.navigate('HomeScreen')
  }

  goToSlide2() {
    this.setState({
      selectedIndex: 1,
      keyUpdate: this.state.keyUpdate + 1
    });
  }

  render() {
    
    return (
      <View style={{ flex: 1 }}>
        <AppIntro
          onSkipBtnClick={() => this.onSkipBtnHandle()}
          onDoneBtnClick={() => this.doneBtnHandle()}>
          <View style={[styles.slide, { backgroundColor: '#406E9F' }]}>
            <View style={[styles.header, { width: windowsWidth }]}>
              <View style={{
                position: 'absolute',
                top: 20,
                left: 20,
                width: windowsWidth,
                height: windowsHeight,
              }}
              >
                <Image style={{ width: 138 * 2.5, height: 83 * 2.5 }} source={require('../files/1.1.png')} />
              </View>
              <View style={{
                position: 'absolute',
                top: 25,
                left: 40,
                width: windowsWidth,
                height: windowsHeight,
              }} level={-15}
              >
                <Image style={{ width: 96 * 2.5, height: 69 * 2.5 }} source={require('../files/1.2.png')} />
              </View>
              <View level={10}>
              </View>
              <View style={{
                position: 'absolute',
                top: 65,
                left: 120,
                width: windowsWidth,
                height: windowsHeight,
              }} level={25}
              >
              </View>
            </View>
            <View style={styles.info}>
              <View level={10}><Text style={styles.title}>Single player</Text></View>
              <View level={15}><Text style={styles.description}>Explore the world in all continents and improve your skill in solo!</Text></View>
            </View>
          </View>  
          <View style={[styles.slide, { backgroundColor: '#a4b602' }]}>
            <View style={[styles.header, { width: windowsWidth }]}>
              <View>
              <Image style={{ width: 50 * 2.5, height: 63 * 2.5 }} source={require('../files/2.1.png')} />

              </View>
              <View style={{
                position: 'absolute',
                top: 30,
                left: 25,
                width: windowsWidth,
                height: windowsHeight,
              }} level={20}
              >
                <Image style={{ width: 101 * 2.5, height: 71 * 2.5 }} source={require('../files/2.2.png')} />
              </View>
              <View style={{
                position: 'absolute',
                top: 10,
                left: 50,
                width: windowsWidth,
                height: windowsHeight,
              }} level={-20}
              >
                <Image style={{ width: 85 * 2.5, height: 73 * 2.5 }} source={require('../files/2.3.png')} />
              </View>
            </View>
            <View style={styles.info}>
              <View level={10}><Text style={styles.title}>Multiplayer</Text></View>
              <View level={15}><Text style={styles.description}>Challenge your friends or random people in the world!</Text></View>
            </View>
          </View>
          <View style={[styles.slide, { backgroundColor: '#fa931d' }]}>
            <View style={[styles.header, { width: windowsWidth }]}>
            <View>
                <Image style={{ width: 50 * 2.5, height: 63 * 2.5 }} source={require('../files/2.1.png')} />
              </View>
              <View style={{
                position: 'absolute',
                top: 80,
                left: 30,
                width: windowsWidth,
                height: windowsHeight,
              }} level={20}
              >
                
                <Image style={{ width: 46 * 2.5, height: 28 * 2.5 }} source={require('../files/3.1.png')} />
              </View>
              <View style={{
                position: 'absolute',
                top: 23,
                left: 25,
                width: windowsWidth,
                height: windowsHeight,
              }} level={20}
              >
                
              </View>
              <View style={{
                position: 'absolute',
                top: 22,
                left: 70,
                width: windowsWidth,
                height: windowsHeight,
              }} level={5}
              >
                <Image style={{ width: 46 * 2.5, height: 98 * 2.5 }} source={require('../files/3.png')} />
              </View>
            </View>
            <View style={styles.info}>
              <View level={10}><Text style={styles.title}>Be a champion</Text></View>
              <View level={15}><Text style={styles.description}>Conquer the leaderboard and collect all the badges!</Text></View>
            </View>
          </View>
          
    
        </AppIntro>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
  header: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pic: {
    width: 75 * 2,
    height: 63 * 2,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  info: {
    flex: 0.5,
    alignItems:"center"
  },
  title: {
    color: '#fff',
    fontSize: 40,
    paddingBottom: 20,
  },
  description: {
    color: '#fff',
    fontSize: 25,
    alignSelf:"auto",
    paddingLeft:20
  },
});

