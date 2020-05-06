import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import {
    Input,
    Item,
    Badge
} from 'native-base';
import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';


const { width } = Dimensions.get('window');

export default class UserProfileScreen extends Component {

    state = {
        player: '',
        loadingInformation: false,
        userPic: '',
        avgScore: 0,
        maxScore: 0,
        nGame: 0,
        not: 0,
        check: false
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
        const my_user = firebase.auth().currentUser;
        const user = this.props.navigation.getParam('uid');
        firebase.database().ref('/users').child(`${user}`).once('value').then(snapshot => {
            var profile = snapshot.toJSON();

            var avg = profile['statistics']['avgScore']
            var max = profile['statistics']['maxScore']
            var nGames = profile['statistics']['nGames']
            var name = profile['username']
            var pic = profile['userpic']

            for (var val in profile['friend']) {
                if (val == my_user.uid){
                    this.setState({
                        check: true
                    })
                }
            }

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
                            <View style = {{marginTop:width / 4.9, alignSelf:"center"}}></View>
                            <TouchableHighlight
                                style={styles.button3}
                                onPress={() => this.props.navigation.goBack()}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: width / 11, height: width / 11 }}
                                    source={require('../files/back.png')}
                                />
                            </TouchableHighlight> 
                            {this.state.check == false ?<TouchableHighlight
                                style={styles.button2}
                                onPress={() => this.friendRequest(this.state.player)}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: width / 7.85, height: width / 7.85 }}
                                    source={require('../files/add_user.png')}
                                />
                            </TouchableHighlight>: null}
                           
                            <Image style={styles.avatar}
                                source={{ uri: this.state.userPic }} />
                            <Text style={styles.name}>{this.state.player} </Text>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.item}>
                            <View style={styles.iconContent}>
                                <Text style={styles.userInfo}>Number of games</Text>
                                <Text style={styles.number}>{this.state.nGame}</Text>
                                <Text style={styles.userInfo}>Avarage score</Text>
                                <Text style={styles.number}>{(this.state.avgScore).toFixed()}</Text>
                                <Text style={styles.userInfo}>Maximum score</Text>  
                                <Text style={styles.number}>{(this.state.maxScore).toFixed()}</Text>  
                                
                                
                                                         
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
        backgroundColor: "#98cbe4",
    },
    headerContent: {
        padding: width / 13.09,
        alignItems: 'center',
    },
    avatar: {
        width: width / 3,
        height: width / 3,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: width / 39.2,
        position:"absolute",
        marginTop: width / 9.8,
        marginLeft: (width/ 2) - 31.5
    },
    number: {
        backgroundColor: "#0095B6", 
        alignSelf:"center",
        textAlign:"center",
        borderWidth: 2,
        marginTop:width / 65.4,
        width:width / 3.92
    },
    name: {
        fontSize: width / 17.8,
        color: "white",
        fontWeight: '600',
        marginTop: width / 3.5,
        left : 6
    },
    userInfo: {
        fontSize: width / 24.54,
        fontWeight: '600',
        marginTop: width / 13,
        marginRight:-(width / 19.6),
        alignSelf:"center"
    },
    body: {
        backgroundColor: "#F2F5F7",
        height: width / 0.785,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignSelf:"center",
        padding: width / 39.2
    },
    infoContent: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: width / 78.54,
        paddingTop: width / 130.9
    },
    button: {
        position: 'relative',
        marginTop: width / 100,
        alignSelf:"center",
        alignContent:"center",
        width: width / 3.41, 
        height: width / 9.81  
    },
    button1: {      
        width: width / 6.54, 
        height: width / 6.54,  
        marginTop: -(width / 2.24),
        marginRight: -(width / 23.1),
        alignSelf: 'flex-end'
    },
    button2: {
        width: width / 7.85, 
        height: width / 7.85,
        marginTop: -(width / 11),
        marginRight: -(width / 196.35),
        alignSelf: 'flex-end'
    },
    button3: {
        width: width / 11, 
        height: width / 11,
        marginTop: -(width / 5.2),
        marginLeft: 0,
        alignSelf: 'flex-start'
    },
    button4: {
        width: width / 7.85, 
        height: width / 7.85,
        marginTop: width / 4.3,
        marginLeft: 0,
        alignSelf: 'flex-start'
    },
    iconContent: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: width / 78.5,
    },
    icon: {
        width: width / 13.09,
        height: width / 13.09,
        marginTop: width /19.635,
    },
    info: {
        fontSize: width / 21.81,
        marginTop: width / 19.6,
        color: "#FFFFFF",
    }
});