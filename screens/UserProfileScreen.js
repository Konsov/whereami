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
    Label,
    Icon,
    Button,
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
                            <View style = {{marginTop:80, alignSelf:"center"}}></View>
                            <TouchableHighlight
                                style={styles.button3}
                                onPress={() => this.props.navigation.navigate('HomeScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: 40, height: 40 }}
                                    source={require('../files/back.png')}
                                />
                            </TouchableHighlight> 
                            <TouchableHighlight
                                style={styles.button4}
                                onPress={() => this.props.navigation.navigate('LeaderScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('../files/leaderboard.png')}
                                />
                            </TouchableHighlight>
                            
                            {this.state.not > 0 ? <TouchableHighlight
                                style={styles.button1}
                                onPress={() => this.props.navigation.navigate('NotificationScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: 43, height: 47 }}
                                    source={require('../files/alarm.png')}
                                />
                            </TouchableHighlight> : <TouchableHighlight
                                style={styles.button1}
                                onPress={() => this.props.navigation.navigate('NotificationScreen')}
                                underlayColor="transparent"
                                activeOpacity={0.7}
                            ><Image
                                    style={{ width: 43, height: 47 }}
                                    source={require('../files/alarm.png')}
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
                                    style={{ width: 50, height: 50 }}
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
                                <Text style={styles.number}>{this.state.avgScore}</Text>
                                <Text style={styles.userInfo}>Maximum score</Text>  
                                <Text style={styles.number}>{this.state.maxScore}</Text>  
                                <Text style={{fontSize: 16,color: "white", fontWeight: '600', marginTop:40, alignSelf:"center"}}>Add friend</Text>   
                                <Item floatingLabel style= {{width:150, alignSelf:"center", marginTop:-25}}>
                                    
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
        position:"absolute",
        marginTop: 40,
        alignSelf:"center"
    },
    number: {
        backgroundColor: "#0095B6", 
        alignSelf:"center",
        textAlign:"center",
        borderColor: "white",
        color: "white", 
        borderWidth: 2,
        marginTop:6,
        width:100
    },
    name: {
        fontSize: 22,
        color: "#000000",
        fontWeight: '600',
        left:10,
        marginTop: 10,
        alignSelf:"center"
    },
    userInfo: {
        fontSize: 16,
        color: "white",
        fontWeight: '600',
        marginTop:30,
        marginRight:-20,
        alignSelf:"center"
    },
    body: {
        backgroundColor: "#778899",
        height: 500,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignSelf:"center",
        padding: 10
    },
    infoContent: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 5,
        paddingTop: 3
    },
    button: {
        position: 'relative',
        marginTop: 4,
        alignSelf:"center",
        alignContent:"center",
        width: 115, 
        height: 40  
    },
    button1: {      
        width: 60, 
        height: 60,  
        marginTop: -175,
        marginRight:-17,
        alignSelf: 'flex-end'
    },
    button2: {
        width: 50, 
        height: 50,
        marginTop: 70,
        marginRight: -2,
        alignSelf: 'flex-end'
    },
    button3: {
        width: 40, 
        height: 40,
        marginTop: -80,
        marginLeft: 0,
        alignSelf: 'flex-start'
    },
    button4: {
        width: 50, 
        height: 50,
        marginTop: 90,
        marginLeft: 0,
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