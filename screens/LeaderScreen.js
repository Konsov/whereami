import React, { Component } from "react";
import { StyleSheet } from 'react-native'
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    List,
    ListItem,
    Text,
    Thumbnail,
    Left,
    Right,
    Body,
    Segment
} from "native-base";
import {
    View,
    TouchableHighlight,
    Image,
    Dimensions
} from 'react-native';
import Modal from 'react-native-modal'

import { ButtonGroup } from 'react-native-elements';

import Leaderboard from 'react-native-leaderboard';

import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';


const { width } = Dimensions.get('window');

var v = 0;

export default class LeaderScreen extends Component {

    state = {
        globalData: [],
        online: [],
        loadingInformation: false,
        username: '',
        profPic: '',
        loadOnl: false,
        val: '',
        modalVisible: false,
        playreq: '',
        filter: 0,
        friendData: [],
        user: [],
        userRank1: 1,
        userRank2:1

    }

    async getMembersListFromDB(val) {
        return firebase.database().ref('/users').child(`${this.state.req[val]['uid']}`).child('online').once('value')
    }

    componentDidMount() {

        this.loadInfo();

    }


    loadInfo() {
        var req = [];
        var fri = [];
        var us_avg;
        var us_max;
        var user = firebase.auth().currentUser;
        firebase.database().ref('/users').once('value').then(snapshot => {
            var profile = snapshot.toJSON();

            for (var val in profile) {
                var name = profile[val]['username'];
                var im = profile[val]['userpic'];
                var avg = profile[val]['statistics']['avgScore'];
                var max = profile[val]['statistics']['maxScore'];
                if (profile[user.uid]['friend'][val] != null){
                    fri.push({ name: name, img: im, avg: (avg).toFixed(), max: max.toFixed() })
                }
                if (user.uid == val){
                    console.log("qui")
                    us_avg = (avg).toFixed();
                    us_max = max.toFixed();
                    fri.push({ name: name, img: im, avg: (avg).toFixed(), max: max.toFixed() })
                }
                req.push({ name: name, img: im, avg: (avg).toFixed(), max: max.toFixed() })
            }

            this.setState({
                globalData: req,
                friendData: fri,
                user: {
                    name: user.displayName,
                    img: user.photoURL,
                    avg: us_avg,
                    max : us_max
                }
            })

        }).then(setTimeout(() => {this.sortArray() }, 250))
    }

    sortArray() {
        var list = this.state.globalData;
        var mapped = list.map(function(el, i) {
            return { index: i, value: el.avg };
        })
        mapped.sort(function(a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            return 0;
        });
        var result1 = mapped.map(function(el){
            return list[el.index];
        });

        let userRank1 = result1.findIndex((item) => {
            return item.name === this.state.user.name;
        })

        var list = this.state.friendData;
        var mapped = list.map(function(el, i) {
            return { index: i, value: el.avg };
        })
        mapped.sort(function(a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            return 0;
        });
        var result2 = mapped.map(function(el){
            return list[el.index];
        });

        let userRank2 = result2.findIndex((item) => {
            return item.name === this.state.user.name;
        })

        this.setState({
            globalData: result1,
            loadingInformation:true,
            friendData: result2,
            userRank1 : userRank1 + 1,
            userRank2 : userRank2 + 1
        })
    }

    renderHeader() {
        
        return (
            <View colors={[, '#1da2c6', '#1695b7']}
                style={{ backgroundColor: '#119abf', padding: 15, paddingTop: 35, alignItems: 'center' }}>
                <Text style={{ fontSize: 25, color: 'white', }}>Leaderboard</Text>
                <View style={{position:'absolute', marginLeft: width / 13, marginTop: width / 13, alignSelf:'flex-start'}}>
                    <Button transparent onPress={() => this.props.navigation.navigate('UserProfileScreen')}>
                                <Image
                                        style={{ width: width / 15, height: width / 15 }}
                                        source={require('../files/back.png')}
                                    />
                    </Button>
                </View>
                <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    marginBottom: 15, marginTop: 20
                }}> 

                    {this.state.filter > 0 ? <Text style={{ color: 'white', fontSize: 25, flex: 1, textAlign: 'right', marginRight: 40 }}>
                        {ordinal_suffix_of(this.state.userRank2)}
                    </Text> : <Text style={{ color: 'white', fontSize: 25, flex: 1, textAlign: 'right', marginRight: 40 }}>
                        {ordinal_suffix_of(this.state.userRank1)}
                    </Text>}
                    <Image style={{ height: width / 3, width: width / 3, borderRadius: 63, borderWidth: 4, borderColor: "white" }}
                        source={{ uri: `${this.state.user.img}` }} />
                    <Text style={{ color: 'white', fontSize: 25, flex: 1, marginLeft: 40 }}>
                        {this.state.user.avg}pts
                    </Text>
                </View>
                <ButtonGroup
                    onPress={(x) => { this.setState({ filter: x }) }}
                    selectedIndex={this.state.filter}
                    buttons={['Global', 'Friends']}
                    containerStyle={{ height: 30 }} />
            </View>
        )
        
    }



    render() {

         const props = {
            labelBy: 'name',
            sortBy: 'avg',
            data: this.state.filter > 0 ? this.state.friendData : this.state.globalData,
            icon: 'img'
        }
        if (this.state.loadingInformation == false) {
            return <PacmanIndicator size={100} />
        } else {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', }}>
                {this.renderHeader()}
                <Leaderboard {...props} />
            </View>
        )
        }


    }
}

const ordinal_suffix_of = (i) => {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        backgroundColor: 'white',
        padding: width / 17.85,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width / 98.18,        
        
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: width / 19.6,
        marginBottom: width / 32.7,
    }
});

