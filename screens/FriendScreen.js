import React, { Component } from "react";
import { StyleSheet } from 'react-native'
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    List,
    ListItem,
    Text,
    Thumbnail,
    Left,
    Right,
    Body,
    Badge
} from "native-base";
import {
    View,
    TouchableHighlight,
    Image
} from 'react-native';
import Modal from 'react-native-modal'

import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

var v = 0;

export default class NotificationScreen extends Component {

    state = {
        req: [],
        online: [],
        loadingInformation: false,
        username: '',
        profPic: '',
        loadOnl: false,
        val: '',
        modalVisible: false,
        playreq: ''

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
        }).then(
            this.setState({
                loadingInformation: true
            })
        )
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
                uid: user.uid
            }
        ).then(this.setState({
            playreq: data,
            modalVisible: true
        })).then(this.checkPlayer(data))
    }
    renderView() {
        if (this.state.loadingInformation == false && this.state.req.length == 3) {
            return <PacmanIndicator size={100} />
        } else {
            return (
                <Container style={styles.container}>
                    <Header style={{ backgroundColor: "#778899" }}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.navigate('UserProfileScreen')}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ fontFamily: "pixel_font" }}>Friend List</Title>
                        </Body>
                        <Right />
                    </Header>

                    <Content style = {{backgroundColor: "#DCDCDC"}}>
                        <List>
                            {this.state.req.map((data, i) => (

                                <ListItem avatar key={i}>
                                    <Left>
                                        <Thumbnail small source={{ uri: data.img }} />
                                        {data.online == true ? <Badge style={{ backgroundColor: 'green', width: 10, height: 10, right: 10, top: 25 }}>
                                        </Badge> : null}
                                    </Left>
                                    <Body>
                                        {data.online == true ? <Text style={{marginTop:12,fontFamily: "pixel_font",left: -12 }}>{data.name}</Text> : <Text style={{ marginTop:12,fontFamily: "pixel_font" }}>{data.name}</Text>}
                                        <Text></Text>
                                    </Body>
                                    <Right style={{marginTop:-10, flexDirection: 'row' }}>
                                        {data.online == true ? <TouchableHighlight
                                        onPress={() => this.playReq(data)}
                                        underlayColor="transparent"
                                        activeOpacity= {0.7}  
                                        ><Image
                                        style={{width: 40,height: 40}}
                                        source={require('../files/playbutton.png')}/>
                                    </TouchableHighlight> : 
                                    <TouchableHighlight
                                    underlayColor="transparent"                               
                                    ><Image
                                    style={{width: 40,height: 40}}
                                    source={require('../files/disabled_button.png')}/>
                                    </TouchableHighlight>}


                                    </Right>
                                </ListItem>
                            ))}
                        </List>
                    </Content>
                </Container>
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
                            <AwesomeButton
                                type="primary"
                                style={styles.button}

                                width={80}
                                onPress={() => this.undoReq()}
                            >Cancel</AwesomeButton>

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
    }
});

