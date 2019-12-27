import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView
} from 'react-native';
import {
    Input,
    Item,
    Label,
    Icon,
    Button,
    Badge
} from 'native-base';
import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

export default class UserProfileScreen extends Component {

    state = {
        player: '',
        loadingInformation: false,
        userPic: '',
        avgScore: 0,
        maxScore: 0,
        nGame: 0,
        req: [],
        not: 0
    }


    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.loadInfo();
        });
    }
    componentWillUnmount() {
        this.focusListener.remove();        
    }

    loadInfo() {
        const user = firebase.auth().currentUser;
        firebase.database().ref('/users').child(`${user.uid}`).once('value').then(snapshot => {
            var profile = snapshot.toJSON();
            var not = 0;
            for (var val in profile['request']) {
                not = not + 1;
            }


            var avg = profile['statistics']['avgScore']
            var max = profile['statistics']['maxScore']
            var nGames = profile['statistics']['nGames']
            var name = profile['username']
            var pic = profile['userpic']

            this.setState({
                player: name,
                avgScore: avg,
                maxScore: max,
                userPic: pic,
                nGame: nGames,
                not: not
            })
        }).then(
            this.setState({
                loadingInformation: true
            })
        )
    }


    friendRequest(username) {
        const user = firebase.auth().currentUser;
        var reff = firebase.database().ref('/users/');
        reff.orderByChild('username').equalTo(`${username}`).once('value').then(function (snapshot) {
            if (snapshot.exists()) {
                for (var root in snapshot.toJSON()) {
                    firebase.database().ref(`users/${root}/request/${user.uid}`).set({
                        name: this.state.player,
                        img: ''
                    })
                }
                alert("Request delivered!")
            } else {
                alert("User " + username + " doesn't exist!");
            }
        }.bind(this))
    }


    renderView() {
        if (this.state.player == '' || this.state.loadingInformation == false) {
            return <PacmanIndicator size={100} />
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <Button transparent style={styles.button1} onPress={() => this.props.navigation.navigate('NotificationScreen')}>
                                <Icon name="heart" style={{ fontSize: 50, color: 'white' }} />
                                <Badge style={{ position: 'absolute', right: 5, height : -50 }}>
                                    <Text>{this.state.not}</Text>
                                </Badge>
                            </Button>
                            <Button transparent style={styles.button2}  onPress={() => this.props.navigation.navigate('FriendScreen')}>
                                <Icon name="people" style={{ fontSize: 50, color: 'white'}} />
                            </Button>
                            <Image style={styles.avatar}
                                source={{ uri: this.state.userPic }} />
                            <Text style={styles.name}>{this.state.player} </Text>
                            <Text style={styles.userInfo}>Numero di partite: {this.state.nGame} </Text>
                            <Text style={styles.userInfo}>Punteggio medio: {this.state.avgScore} </Text>
                            <Text style={styles.userInfo}>Punteggio massimo: {this.state.maxScore} </Text>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.item}>
                            <View style={styles.iconContent}>
                                <Image style={styles.icon} source={{ uri: "https://img.icons8.com/material-rounded/24/000000/home.png" }} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.info} onPress={() => { this.props.navigation.navigate('HomeScreen') }}>Home</Text>
                            </View>
                            <View style={styles.infoContent}>
                                <Item floatingLabel>
                                    <Label>Username</Label>
                                    <Input autoCorrect={false}
                                        autoCapitalize="none"
                                        onChangeText={(username) => this.setState({ username })} />
                                </Item>
                                <AwesomeButton
                                    type="primary"
                                    style={styles.button}
                                    onPress={() => this.friendRequest(this.state.username)}
                                >Friend Request
                                </AwesomeButton>
                            </View>
                        </View>
                        <View style={styles.infoContent}>

                        </View>
                    </View>
                </View>
            )
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderView()}
            </View>
        )


    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: "#DCDCDC",
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        color: "#000000",
        fontWeight: '600',
    },
    userInfo: {
        fontSize: 16,
        color: "#778899",
        fontWeight: '600',
    },
    body: {
        backgroundColor: "#778899",
        height: 500,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        padding: 10
    },
    infoContent: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 5,
        paddingTop: 3
    },
    button1: {        
        marginTop: -20,
        height: 50,
        alignSelf: 'flex-end'
    },
    button2: {
        height: 50,
        marginTop: -50,
        alignSelf: 'flex-start'
    },
    iconContent: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 5,
    },
    icon: {
        width: 30,
        height: 30,
        marginTop: 20
    },
    info: {
        fontSize: 18,
        marginTop: 20,
        color: "#FFFFFF",
    }
});