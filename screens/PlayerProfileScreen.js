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
import Modal from 'react-native-modal'
import firebase from '../services/firebase';
import { BarIndicator } from 'react-native-indicators';



const { width, height } = Dimensions.get('window');

export default class UserProfileScreen extends Component {

    state = {
        player: '',
        loadingInformation: false,
        userPic: '',
        avgScore: 0,
        maxScore: 0,
        nGame: 0,
        not: 0,
        check: false,
        win:0,        
        gamer: false,
        extrovert: false,
        doppelganger: false,
        modalVisible: false,
        value: '',
        text: ''
        
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
            var win = profile['statistics']['win']
            var name = profile['username']
            var pic = profile['userpic']
            var nGames_multi = profile['statistics']['nGames_multi']
            var quit = profile['statistics']['quit']
            var nGames_sing = profile['statistics']['nGames_sing']
            var center = profile['statistics']['badge']['center']
            var fire = profile['statistics']['badge']['fire']
            var time = profile['statistics']['badge']['time']
            var gamer = profile['statistics']['badge']['gamer']
            var doppelganger = profile['statistics']['badge']['doppelganger']
            var extrovert = profile['statistics']['badge']['extrovert']
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
                nGame: nGames,
                win: win,
                nGames_multi: nGames_multi,
                nGames_sing: nGames_sing,
                center: center,
                fire: fire,
                time: time,
                gamer: gamer,
                extrovert: extrovert,
                doppelganger: doppelganger,
                quit:quit
            })
        }).then(
            this.setState({
                loadingInformation: true
            })
        )
    }

    renderModal() {
        return (
            <Modal
                testID={'modal2'}
                visible={this.state.modalVisible}
                backdropColor="#B4B3DB"
                backdropOpacity={0.8}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                transparent={true}
                animationType="slide"
                hasBackdrop={true}
                onBackdropPress={() => this.setState({ modalVisible: false })}>
                <View style={styles.content}>
                    <View style={styles.modalView}>
                        {this.state.modalVisible == true ?                         
                           
                            <ScrollView horizontal={true}>
                                <View>
                                    {this.state.value == 'gold' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/gold.png')}
                                    /> : this.state.value == 'silver' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/silver.png')}
                                    /> : this.state.value == 'bronze' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/bronze.png')}
                                    /> : this.state.value == 'fire' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/fire.png')}
                                    /> : this.state.value == 'gold_2' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/gold_2.png')}
                                    /> : this.state.value == 'silver_2' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/silver_2.png')}
                                    /> : this.state.value == 'bronze_2' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/bronze_2.png')}
                                    /> : this.state.value == 'time' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/stopwatch.png')}
                                    /> : this.state.value == 'game_1' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/game_1.png')}
                                    /> : this.state.value == 'game_2' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/game_2.png')}
                                    /> : this.state.value == 'game_3' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/game_3.png')}
                                    /> : this.state.value == 'center' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4}}
                                        source={require('../files/target.png')}
                                    /> : this.state.value == 'flower' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/flower.png')}
                                    /> : this.state.value == 'extrovert' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/group.png')}
                                    /> : this.state.value == 'gamer' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/joystick.png')}
                                    /> : this.state.value == 'doppelganger' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/lens.png')}
                                    /> : this.state.value == 'red-card' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/red-card.png')}
                                    /> : this.state.value == 'yellow-card' ? <Image
                                        style={{ width: height / 6.4, height: height / 6.4 }}
                                        source={require('../files/yellow-card.png')}
                                    /> : null}
                                </View>

                            </ScrollView> : null}

                        <Text style={styles.contentTitle}>{this.state.text}</Text>
                        <View style={{ flexDirection: 'row' }}>

                        </View>
                    </View>

                </View>
            </Modal>
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


    renderView() {
        if (this.state.player == '' || this.state.loadingInformation == false) {
            return (<View style={{ marginTop:height/3.5, height: height/3.5}}>
                <Image source={require('../files/logo2.png')} style={{width: '100%', height: '100%',resizeMode: 'stretch'}}/>
                <BarIndicator style={{marginTop:height/23}} size={40} />
                </View>)
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
                                <View style = {{ flexDirection: 'column',left: -(width/2.7), marginTop:10}} >
                                    <Text style={styles.number}>{this.state.nGame}</Text>
                                    <Text style={styles.userInfo}>Games</Text>
                                </View>
                                <View style = {{ flexDirection: 'column',left: -(width/7), marginTop: -46}} >
                                    <Text style={styles.number}>{this.state.win}</Text>
                                    <Text style={styles.userInfo}>Win</Text>
                                </View>
                                <View style = {{ flexDirection: 'column', marginTop: -47.5,left: (width/10)}} >                                    
                                    <Text style={styles.number}>{(this.state.avgScore).toFixed()}</Text>                                
                                    <Text style={styles.userInfo}>Avg score</Text>
                                </View>
                                <View style = {{ flexDirection: 'column', marginTop: -47.5, left: (width/2.7)}}>                                  
                                    <Text style={styles.number}>{(this.state.maxScore).toFixed()}</Text>
                                    <Text style={styles.userInfo}>Max score</Text> 
                                </View>   
                                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign:'center', marginTop: 20}}>Badges</Text>  
                                

                                <ScrollView>
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 23 }}>
                                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Play 5 single player game.", value: "bronze" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.nGames_sing > 5 || this.state.nGames_sing == 5 ? <Image
                                                            style={{ width: width / 5, height: width / 5 }}
                                                            source={require('../files/bronze.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/bronze.png')}
                                                            />}

                                                        <Text style={styles.userInfo}>First steps</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 7 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Play 20 single player game.", value: "silver" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>

                                                        {this.state.nGames_sing > 20 || this.state.nGames_sing == 20 ? <Image
                                                            style={{ width: width / 5, height: width / 5 }}
                                                            source={require('../files/silver.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/silver.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Expert</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 7.3 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Play 50 single player game.", value: "gold" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.nGames_sing > 50 || this.state.nGames_sing == 50 ? <Image
                                                            style={{ width: width / 5, height: width / 5 }}
                                                            source={require('../files/gold.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/gold.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Veteran</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 18, marginLeft: 9 }}>
                                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Play 5 multiplayer game.", value: "game_1" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.nGames_multi > 5 || this.state.nGames_multi == 5 ? <Image
                                                            style={{ width: width / 5, height: width / 5 }}
                                                            source={require('../files/game_1.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/game_1.png')}
                                                            />}

                                                        <Text style={styles.userInfo}>Explore online</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 17 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Play 20 multiplayer game.", value: "game_2" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.nGames_multi > 20 || this.state.nGames_multi == 20 ? <Image
                                                            style={{ width: width / 5, height: width / 5 }}
                                                            source={require('../files/game_2.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/game_2.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Online specialist</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 16 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Play 50 multiplayer game.", value: "game_3" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.nGames_multi > 50 || this.state.nGames_multi == 50 ? <Image
                                                            style={{ width: width / 5, height: width / 5 }}
                                                            source={require('../files/game_3.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/game_3.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Online master</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 18 }}>
                                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Win 5 multiplayer game.", value: "bronze_2" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.win > 5 || this.state.win == 5 ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/bronze_2.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5, marginTop: 10 }}
                                                                source={require('../files/bronze_2.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Great</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 6.5 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Win 20 multiplayer game.", value: "silver_2" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.win > 20 || this.state.win == 20 ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/silver_2.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5, marginTop: 10 }}
                                                                source={require('../files/silver_2.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Champion</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 7.5 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Win 50 multiplayer game.", value: "gold_2" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.win > 50 || this.state.win == 50 ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/gold_2.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5, marginTop: 10 }}
                                                                source={require('../files/gold_2.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>GOAT</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 18 }}>
                                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Below 100km from target.", value: "center" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.center == true ? <Image
                                                            style={{ width: width / 5, height: width / 5 }}
                                                            source={require('../files/target.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/target.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Really close</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 8, marginTop: -10 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Play 15 game in a day.", value: "time" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.time == true ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/stopwatch.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, marginTop: 10, opacity: 0.5 }}
                                                                source={require('../files/stopwatch.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Binge play </Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 7, marginTop: -10 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Win 5 game in a row.", value: "fire" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.fire == true ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/fire.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, marginTop: 10, opacity: 0.5 }}
                                                                source={require('../files/fire.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>On fire</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 18 }}>
                                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Have 5 or more friend.", value: "extrovert" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.extrovert == true ? <Image
                                                            style={{ width: width / 5, height: width / 5 }}
                                                            source={require('../files/group.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/group.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Extrovert</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 7, marginTop: -10 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Play every day for 30 days.", value: "gamer" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.gamer == true ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/joystick.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, marginTop: 10, opacity: 0.5 }}
                                                                source={require('../files/joystick.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Real Gamer</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 10, marginTop: -10 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Change your profile picture.", value: "doppelganger" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.doppelganger == true ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/lens.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, marginTop: 10, opacity: 0.5 }}
                                                                source={require('../files/lens.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Doppelganger</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 18, paddingBottom: 10 }}>
                                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Collect all the other badge.", value: "flower" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.nGames_sing >= 50 && this.state.nGames_multi >= 50 && this.state.win >= 50
                                                            && this.state.center && this.state.gamer && this.state.time && this.state.fire && this.state.doppelganger
                                                            && this.state.quit >= 30 && this.state.extrovert ? <Image
                                                                style={{ width: width / 5, height: width / 5 }}
                                                                source={require('../files/flower.png')}
                                                            /> : <Image
                                                                style={{ width: width / 5, height: width / 5, opacity: 0.5 }}
                                                                source={require('../files/flower.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>All Badges</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 8, marginTop: -10 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Quit from 10 games", value: "yellow-card" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.quit >= 10 ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/yellow-card.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, marginTop: 10, opacity: 0.5 }}
                                                                source={require('../files/yellow-card.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Quitter</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
                                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: width / 6.5, marginTop: -10 }}>
                                                <TouchableHighlight
                                                    onPress={() => this.setState({ modalVisible: true, text: "Quit from 30 games.", value: "red-card" })}
                                                    underlayColor="transparent"
                                                    activeOpacity={0.7}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                        {this.state.quit >= 30 ? <Image
                                                            style={{ width: width / 5, height: width / 5, marginTop: 10 }}
                                                            source={require('../files/red-card.png')}
                                                        /> : <Image
                                                                style={{ width: width / 5, height: width / 5, marginTop: 10, opacity: 0.5 }}
                                                                source={require('../files/red-card.png')}
                                                            />}
                                                        <Text style={styles.userInfo}>Real quitter</Text>
                                                    </View>

                                                </TouchableHighlight>
                                            </View>
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
                {this.renderModal()}
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
        alignSelf:"center",
        textAlign:"center",
        fontWeight: 'bold',        
        fontSize:19
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
        flex: 1
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
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: height/ 4,
        marginBottom: height / 4
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
});