import React, { Component } from "react";
import { StyleSheet } from 'react-native'
import {
    Button,
    Text,
    Item,
    Input
} from "native-base";
import {
    View,
    TouchableHighlight,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity, KeyboardAvoidingView
} from 'react-native';
import Modal from 'react-native-modal';

import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';

import firebase from '../services/firebase';import { BarIndicator } from 'react-native-indicators';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
var v = 0;


const { width } = Dimensions.get('window');

const oddRowColor = "white";
const evenRowColor = "#f2f5f7";

export default class NotificationScreen extends Component {

    state = {
        req: [],
        online: [],
        loadingInformation: false,
        username: '',
        profPic: 'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png',
        loadOnl: false,
        val: '',
        modalVisible: false,
        playreq: '',
        user: ''

    }

    async getMembersListFromDB(val) {
        return firebase.database().ref('/users').child(`${this.state.req[val]['uid']}`).child('online').once('value')
    }

    componentDidMount() {

        this.loadInfo();

    }

    push() {
        let req = [...this.state.req];

        for (var val in req) {
            if (v == val)
                req[val]['online'] = this.state.val
        }

        v = v + 1;
        this.setState({ req });
    }

    isOnline() {
        var on = [];
        var k;
        v = 0;
        firebase.database().ref('/users').once('value').then(snap => {

            for (var val in this.state.req) {
                this.getMembersListFromDB(val).then(snapshot => {
                    k = snapshot.val()
                    on.push(snapshot.val())
                    this.setState({
                        val: k
                    })
                    this.push(val);
                })
            }
            setTimeout(() => { }, 1500)
        }).then(setTimeout(() => {this.setState({
            loadingInformation: true
        }) }, 1000))
    }

    undoReq() {
        const user = firebase.auth().currentUser;
        firebase.database().ref('users/' + this.state.playreq + '/playRequest/' + user.uid).remove()
        this.setState({
            modalVisible: false
        });
    }

    loadInfo() {
        var req = [];
        const user = firebase.auth().currentUser;
        firebase.database().ref('/users').child(`${user.uid}`).once('value').then(snapshot => {
            var profile = snapshot.toJSON();

            var username = profile['username']
            var pic = profile['userpic']
            for (var val in profile['friend']) {
                var name = profile['friend'][val]['name'];
                var im = profile['friend'][val]['img'];
                req.push({ name: name, img: im, uid: val, online: false })
            }

            this.setState({
                req: req,
                username: username,
                profPic: pic

            })
        }).then(this.isOnline())
    }

    checkPlayer(data) {
        const user = firebase.auth().currentUser;
        var game = false;
        firebase.database().ref('/users').child(`${data}`).child('playRequest').on('child_removed', (value) => {
            this.setState({
                modalVisible: false
            })
            var ref = firebase.database().ref('/Games');
            ref.orderByChild('player2/user').equalTo(`${user.uid}`).once('value').then(function (snapshot) {
                if (snapshot.exists()) {
                    ref.orderByChild('player1/user').equalTo(`${data}`).once('value').then(function (snap) {
                        if (snap.exists()) {
                            game = true;
                        }
                    })
                 
                }
            }).then(setTimeout(() => {if (game){
                this.props.navigation.navigate('GameStack')
            } }, 1500))
        })

    }
    playReq(data) {
        const user = firebase.auth().currentUser;
        firebase.database().ref('users/' + data + '/playRequest/' + user.uid).set(
            {
                user: this.state.username,
                uid: user.uid,
                userpic: user.photoURL
            }
        ).then(this.setState({
            playreq: data,
            modalVisible: true
        })).then(this.checkPlayer(data))
    }

    renderItem = ({ item, index }) => {
        return this.props.renderItem
          ? this.props.renderItem(item, index)
          : this.defaultRenderItem(item, index);
    };

    defaultRenderItem = (item, index) => {

        const evenColor = this.props.evenRowColor || evenRowColor;
        const oddColor = this.props.oddRowColor || oddRowColor;
        const rowColor = index % 2 === 0 ? evenColor : oddColor;
    
        const rowJSx = (
          <View style={[styles.row, { backgroundColor: rowColor }]}>
            <View style={styles.left}>
                <Text>     </Text>
                <Image
                  source={{ uri: item['img'] }}
                  style={styles.avatar}
                />
              
              <Text style={styles.label} numberOfLines={1}>
                {item['name']}
              </Text>
            </View>
            <View style={styles.score}>
                {item['online'] == true ? 
                <TouchableHighlight
                onPress={() => this.playReq(item.uid)}
                underlayColor="transparent"
                activeOpacity= {0.7}  
                ><Image
                        style={{width: 40,height: 40}}
                        source={require('../files/play_button.png')}/>
                </TouchableHighlight> : 
                <TouchableHighlight
                underlayColor="transparent"                               
                ><Image
                    style={{width: 40,height: 40}}
                    source={require('../files/no_play_button.png')}/>
                </TouchableHighlight>}
            </View>
          </View>
        );
        return (
            <TouchableOpacity onPress={() => this.onRowPress(item)}>
              {rowJSx}
            </TouchableOpacity>
        )  
    }
    
    friendRequest(username) {
        const user = firebase.auth().currentUser;
        var reff = firebase.database().ref('/users/');
        reff.orderByChild('username').equalTo(`${username}`).once('value').then(function (snapshot) {
            if (snapshot.exists()) {
                for (var root in snapshot.toJSON()) {
                    firebase.database().ref(`users/${root}/request/${user.uid}`).set({
                        name: user.displayName,
                        img: ''
                    })
                }
                alert("Request delivered!")
            } else {
                alert("User " + username + " doesn't exist!");
            }
        }.bind(this))
    }

    
    onRowPress(data){
        const user = firebase.auth().currentUser;
        if (data.uid == user.uid){
            this.props.navigation.navigate('UserProfileScreen')
        } else {
            this.props.navigation.navigate('PlayerProfileScreen', {uid : data.uid})
        }
    }

    renderView() {
        const { req } = this.state;
        if (this.state.loadingInformation == false && this.state.req.length == 3) {
            return (<View style={{ marginTop:windowHeight/3.5, height: windowHeight/3.5}}>
                <Image source={require('../files/logo2.png')} style={{width: '100%', height: '100%',resizeMode: 'stretch'}}/>
                <BarIndicator style={{marginTop:windowHeight/23}} size={40} />
                </View>)
        } else {
            return (
                <KeyboardAvoidingView style={{flex:1}} behavior="height">
                    <View colors={[, '#1da2c6', '#1695b7']}
                        style={{ backgroundColor: '#98cbe4', padding: 15, alignItems: 'center',flex:0.05 }}>
                        <Text style={{ fontSize: 25, color: 'white', }}>Friend List</Text>
                        <View style={{position:'absolute', marginLeft: width / 18, marginTop:width / 35 ,alignSelf:'flex-start'}}>
                            <Button transparent onPress={() => this.props.navigation.navigate('UserProfileScreen')}>
                                        <Image
                                                style={{ width: width / 15, height: width / 15 }}
                                                source={require('../files/back.png')}
                                            />
                            </Button>
                        </View>
                    
                    
                    </View>
                    <View style={{flex:0.70}}>
                        <FlatList
                            data={req}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={data => this.renderItem(data)}
                        />
                    </View>
                    <View style={{flex:0.25, borderTopWidth: 1, borderColor: "#d6d7da"}}>
                        <Text style={{fontSize: width / 24.54, fontWeight: '600', marginTop:width / 9.8, alignSelf:"center"}}>Add friend</Text> 
                        <Item floatingLabel style= {{width:width / 2.6, alignSelf:"center", marginTop:-(width / 15.7)}}>
                            <Input autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(user) => this.setState({ user })} />
                        </Item>
                        <View style={{width:width / 2.8, alignSelf:"center", marginBottom:10, borderWidth:0}}>
                            <AwesomeButtonRick         
                                onPress={() => this.friendRequest(this.state.user)}  
                                type="anchor"
                            >FRIEND REQUEST</AwesomeButtonRick>
                        </View>
                    </View>
            </KeyboardAvoidingView>
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderView()}
                <Modal
                    testID={'modal'}
                    isVisible={this.state.modalVisible}
                    backdropColor="#B4B3DB"
                    backdropOpacity={0.8}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}>
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>Waiting for the other player response...</Text>
                        <View style={{ flexDirection: 'row' }}>
                        <TouchableHighlight
                            onPress={() => this.undoReq()}
                            underlayColor="transparent"
                            activeOpacity= {0.7}  
                            style={{left: 5}}
                            ><Image
                                style={{width: 50,height: 50}}
                                source={require('../files/error.png')}/>
                        </TouchableHighlight>   

                        </View>
                    </View>
                </Modal>
            </View>
        )


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    row: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: "#d6d7da"
    },    
    left: {
        flexDirection: "row",
        alignItems: "center"
    },
    label: {
        fontSize: 17,
        flex: 1,
        paddingRight: 80
    },    
    score: {
        position: "absolute",
        right: 15,
        paddingLeft: 15
    },    
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        marginRight: 10
    }
});

