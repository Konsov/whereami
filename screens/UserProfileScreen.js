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


const { width, height } = Dimensions.get('window');

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
                                onPress={() => this.props.navigation.goBack()}
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
                                <View style = {{ flexDirection: 'column',left: -(width/3), marginTop:10}} >
                                    <Text style={styles.number}>{this.state.nGame}</Text>
                                    <Text style={styles.userInfo}>Games</Text>
                                </View>
                                <View style = {{ flexDirection: 'column', marginTop: -46}} >                                    
                                    <Text style={styles.number}>{(this.state.avgScore).toFixed()}</Text>                                
                                    <Text style={styles.userInfo}>Avg score</Text>
                                </View>
                                <View style = {{ flexDirection: 'column', marginTop: -48, left: (width/3)}}>                                  
                                    <Text style={styles.number}>{(this.state.maxScore).toFixed()}</Text>
                                    <Text style={styles.userInfo}>Max score</Text> 
                                </View>   
                                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign:'center', marginTop: 20}}>Badges</Text>  
                                
                                
                                <ScrollView>
                                    <View style={{flexDirection:'column'}}>
                                        <View style = {{flexDirection:'row', marginTop:10, marginLeft:18}}>
                                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                                {this.state.nGame > 5 || this.state.nGame == 5 ?<Image
                                                    style={{ width: width / 5, height: width / 5}}
                                                    source={require('../files/bronze.png')}
                                                />: <Image
                                                style={{ width: width / 5, height: width / 5, opacity: 0.5}}
                                                source={require('../files/bronze.png')}
                                                />}
                                                
                                                <Text style={styles.userInfo}>5 single play</Text>
                                            </View>
                                            <View style={{flexDirection:'column', alignItems:'center', marginLeft:width/9.8}}>
                                                {this.state.nGame > 20 || this.state.nGame == 20 ?  <Image
                                                    style={{ width: width / 5, height: width / 5}}
                                                    source={require('../files/silver.png')}
                                                />:  <Image
                                                style={{ width: width / 5, height: width / 5, opacity: 0.5}}
                                                source={require('../files/silver.png')}
                                                />}                                               
                                                <Text style={styles.userInfo}>20 single play</Text>
                                            </View>
                                            <View style={{flexDirection:'column', alignItems:'center', marginLeft:width/9.8}}>
                                                {this.state.nGame > 50 || this.state.nGame == 50 ? <Image
                                                    style={{ width: width / 5, height: width / 5}}
                                                    source={require('../files/gold.png')}
                                                />: <Image
                                                style={{ width: width / 5, height: width / 5, opacity: 0.5}}
                                                source={require('../files/gold.png')}
                                                />}
                                                <Text style={styles.userInfo}>50 single play</Text>
                                            </View>                                            
                                        </View>
                                        <View style = {{flexDirection:'row', marginTop:18, marginLeft:18}}>
                                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                                {this.state.nGame > 5 || this.state.nGame == 5 ?<Image
                                                    style={{ width: width / 5, height: width / 5}}
                                                    source={require('../files/game_1.png')}
                                                />: <Image
                                                style={{ width: width / 5, height: width / 5, opacity: 0.5}}
                                                source={require('../files/game_1.png')}
                                                />}
                                                
                                                <Text style={styles.userInfo}>5 online play</Text>
                                            </View>
                                            <View style={{flexDirection:'column', alignItems:'center', marginLeft:width/10}}>
                                                {this.state.nGame > 20 || this.state.nGame == 20 ?  <Image
                                                    style={{ width: width / 5, height: width / 5}}
                                                    source={require('../files/game_2.png')}
                                                />:  <Image
                                                style={{ width: width / 5, height: width / 5, opacity: 0.5}}
                                                source={require('../files/game_2.png')}
                                                />}                                               
                                                <Text style={styles.userInfo}>20 online play</Text>
                                            </View>
                                            <View style={{flexDirection:'column', alignItems:'center', marginLeft:width/10}}>
                                                {this.state.nGame > 50 || this.state.nGame == 50 ? <Image
                                                    style={{ width: width / 5, height: width / 5}}
                                                    source={require('../files/game_3.png')}
                                                />: <Image
                                                style={{ width: width / 5, height: width / 5, opacity: 0.5}}
                                                source={require('../files/game_3.png')}
                                                />}
                                                <Text style={styles.userInfo}>50 online play</Text>
                                            </View>                                            
                                        </View>
                                        <View style = {{flexDirection:'row', marginTop:10, marginLeft:18}}>
                                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                                <Image
                                                    style={{ width: width / 5, height: width / 5, marginTop:10, opacity: 0.5 }}
                                                    source={require('../files/bronze_2.png')}
                                                />
                                                <Text style={styles.userInfo}>5 online win</Text>
                                            </View>
                                            <View style={{flexDirection:'column', alignItems:'center', marginLeft:width/9}}>
                                                <Image
                                                    style={{ width: width / 5, height: width / 5, marginTop:10, opacity: 0.5 }}
                                                    source={require('../files/silver_2.png')}
                                                />
                                                <Text style={styles.userInfo}>20 online win</Text>
                                            </View>
                                            <View style={{flexDirection:'column', alignItems:'center', marginLeft:width/9}}>
                                                <Image
                                                    style={{ width: width / 5, height: width / 5, marginTop:10, opacity: 0.5 }}
                                                    source={require('../files/gold_1.png')}
                                                />
                                                <Text style={styles.userInfo}>50 online win</Text>
                                            </View>      
                                        </View>
                                        <View style = {{flexDirection:'row', marginTop:20, marginLeft:18}}>
                                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                                <Image
                                                    style={{ width: width / 5, height: width / 5, opacity: 0.5}}
                                                    source={require('../files/target.png')}
                                                />
                                                <Text style={styles.userInfo}>Really close</Text>
                                            </View>
                                            <View style={{flexDirection:'column', alignItems:'center', marginLeft:width/8, marginTop:-10}}>
                                                <Image
                                                    style={{ width: width / 5, height: width / 5, marginTop:10, opacity: 0.5 }}
                                                    source={require('../files/stopwatch.png')}
                                                />
                                                <Text style={styles.userInfo}>So fast!</Text>
                                            </View>
                                            <View style={{flexDirection:'column', alignItems:'center', marginLeft:width/6.5, marginTop:-10}}>
                                                <Image
                                                    style={{ width: width / 5, height: width / 5, marginTop:10, opacity: 0.5 }}
                                                    source={require('../files/fire.png')}
                                                />
                                                <Text style={styles.userInfo}>On fire</Text>
                                            </View>
                                        </View>

                                        <Text style={{fontSize: width / 24.54, fontWeight: '600', marginTop:width / 9.8, alignSelf:"center"}}>Add friend</Text> 
                                        <Item floatingLabel style= {{width:width / 2.6, alignSelf:"center", marginTop:-(width / 15.7)}}>
                                            
                                            <Input autoCorrect={false}
                                                autoCapitalize="none"
                                                onChangeText={(username) => this.setState({ username })} />
                                        </Item>
                                        <View style={{width:width / 2.8, alignSelf:"center", marginBottom:10}}>
                                            <AwesomeButtonRick
                                                    
                                            onPress={() => this.friendRequest(this.state.username)}  
                                            
                                            type="anchor"
                                            >FRIEND REQUEST</AwesomeButtonRick>
                                        </View> 
                                    </View>
                                    
                                    
                                       
                                </ScrollView>
                             
                                
                                                         
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
        alignSelf:"center"
    },
    number: {
        alignSelf:"center",
        textAlign:"center",
        fontWeight: 'bold',
        fontSize:19
    },
    name: {
        fontSize: width / 17.8,
        color: "white",
        fontWeight: '600',
        left: width / 39.27,
        marginTop: -(width / 15),
        alignSelf:"center"
    },
    userInfo: {
        fontSize: width / 24.54,
        fontWeight: '600',
        alignSelf:"center"
    },
    body: {
        backgroundColor: "#F2F5F7",
        height: width / 0.785,
        flex: 1
    },
    item: {
        flexDirection: 'row',
        flex:1
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