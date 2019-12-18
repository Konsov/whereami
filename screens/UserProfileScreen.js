import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import {
    Input,
    Item,
    Label
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
        nGame: 0
    }

    componentDidMount() {
        this.loadInfo();
    }

    loadInfo() {
        const user = firebase.auth().currentUser;
        console.log(user.uid)
        firebase.database().ref('/users').child(`${user.uid}`).once('value').then(snapshot => {
            var profile = snapshot.toJSON();
            console.log(profile)
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
                nGame: nGames
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
                for (var root in snapshot.toJSON()){
                    firebase.database().ref(`users/${root}/request/${user.uid}`).set({
                        name: root
                   })
                }          

                
                alert("Request delivered!")
            } else {
                alert("User "+ username + " doesn't exist!");
            }
        }.bind(this))
    }

    renderView() {
        if (this.state.player == '' || this.loadingInformation == false) {
            return <PacmanIndicator size={100} />
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
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
                                <Text style={styles.info} onPress={() => { this.props.navigation.goBack() }}>Home</Text>
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
                                > Friend Request
                                </AwesomeButton>
                            </View>

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
    },
    infoContent: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 5,
        paddingTop: 3
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