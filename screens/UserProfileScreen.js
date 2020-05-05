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
                            <View style = {{marginTop:width / 4.9, alignSelf:"center"}}></View>
                            <TouchableHighlight
                                style={styles.button3}
                                onPress={() => this.props.navigation.navigate('HomeScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: width / 11, height: width / 11 }}
                                    source={require('../files/back.png')}
                                />
                            </TouchableHighlight> 
                            <TouchableHighlight
                                style={styles.button4}
                                onPress={() => this.props.navigation.navigate('LeaderScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: width / 7.85, height: width / 7.85 }}
                                    source={require('../files/leaderboard.png')}
                                />
                            </TouchableHighlight>
                            
                            {this.state.not > 0 ? <TouchableHighlight
                                style={styles.button1}
                                onPress={() => this.props.navigation.navigate('NotificationScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: width / 9.13, height: width / 8.35 }}
                                    source={require('../files/music.png')}
                                />
                            </TouchableHighlight> : <TouchableHighlight
                                style={styles.button1}
                                onPress={() => this.props.navigation.navigate('NotificationScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: width / 9.13, height: width / 8.35 }}
                                    source={require('../files/music.png')}
                                />
                            </TouchableHighlight>}
                            {this.state.not > 0 ? <Badge style={{ position: 'absolute', right: 25, height : -45, marginTop: 35 }}>
                                    <Text>{this.state.not}</Text>
                                </Badge> : null}
                            <TouchableHighlight
                                style={styles.button2}
                                onPress={() => this.props.navigation.navigate('FriendScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: width / 7.85, height: width / 7.85 }}
                                    source={require('../files/users.png')}
                                />
                            </TouchableHighlight>
                           
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
                                <Text style={{fontSize: width / 24.54, fontWeight: '600', marginTop:width / 9.8, alignSelf:"center"}}>Add friend</Text>   
                                <Item floatingLabel style= {{width:width / 2.6, alignSelf:"center", marginTop:-(width / 15.7)}}>
                                    
                                    <Input autoCorrect={false}
                                        autoCapitalize="none"
                                        onChangeText={(username) => this.setState({ username })} />
                                </Item>
                                <View style={{width:width / 2.8, alignSelf:"center"}}>
                                    <AwesomeButtonRick
                                               
                                    onPress={() => this.friendRequest(this.state.username)}  
                                    
                                    type="anchor"
                                    >FRIEND REQUEST</AwesomeButtonRick>
                                </View>
                                
                                                         
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
        backgroundColor: "#119abf",
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
        alignSelf:"center"
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
        left: width / 39.27,
        marginTop: width / 39.2,
        alignSelf:"center"
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
        marginTop: width / 5.61,
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