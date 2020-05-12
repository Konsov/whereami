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
    Body
} from "native-base";
import {
    View,
    TouchableHighlight,
    Image,
    Dimensions,
    FlatList 
} from 'react-native';

import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';


const oddRowColor = "white";
const evenRowColor = "#f2f5f7";


const { width } = Dimensions.get('window');

export default class NotificationScreen extends Component {

    state = {
        req: [],
        img: [],
        loadingInformation: false,
        username: '',
        profPic: ''
    }

    componentDidMount() {
        this.loadInfo();
        
    }

    loadInfo() {
        var req = [];
        const user = firebase.auth().currentUser;
        firebase.database().ref('/users').child(`${user.uid}`).once('value').then(snapshot => {
            var profile = snapshot.toJSON();

            var username = profile['username']
            var pic = profile['userpic']
            for (var val in profile['request']) { 
                var name = profile['request'][val]['name'];
                var im = profile['request'][val]['img'];
                req.push({ name: name, img: im })
            }

            this.setState({
                req: req,
                username: username,
                profPic: pic

            })
        }).then(
            this.setState({
                loadingInformation: true
            })
        )
    }

    renderItem = ({ item, index }) => {
        return this.props.renderItem
          ? this.props.renderItem(item, index)
          : this.defaultRenderItem(item, index);
    };

    confirmReq(data,i){
        const user = firebase.auth().currentUser;
        firebase.database().ref('/users').child(`${user.uid}`).child('request').once('value').then(snapshot => {
            var req = snapshot.toJSON();
            for (var val in req){
                if (req[val]['name'] == data.name){
                    firebase.database().ref('/users').child(`${user.uid}`).child(`friend/${val}`).set({
                        name: data.name, 
                        img: data.img
                    })
                    firebase.database().ref('/users').child(`${val}`).child(`friend/${user.uid}`).set({
                        name: this.state.username,
                        img: this.state.profPic
                    })

                    snapshot.ref.child(`${val}`).remove();
                    this.loadInfo()
                }
            }
        })
    }
    denyReq(data,i){
        const user = firebase.auth().currentUser;
        firebase.database().ref('/users').child(`${user.uid}`).child('request').once('value').then(snapshot => {
            var req = snapshot.toJSON();
            for (var val in req){
                if (req[val]['name'] == data.name){
                    snapshot.ref.child(`${val}`).remove();
                    this.loadInfo()
                }
            }
        })

    }

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
              
              <Text style={styles.label} numberOfLines={2}>
                {item['name']} has sent you a friend request
              </Text>
            </View>
            <View style={styles.score}>
            <TouchableHighlight
                onPress={() => this.confirmReq(item,index)}
                underlayColor="transparent"
                activeOpacity= {0.7}  
                    ><Image
                        style={{width: 40,height: 40}}
                        source={require('../files/success.png')}/>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => this.denyReq(item,index)}
                underlayColor="transparent"
                activeOpacity= {0.7}  
                style={{left: 5}}
                    ><Image
                        style={{width: 40,height: 40}}
                        source={require('../files/error.png')}/>
            </TouchableHighlight>
            </View>
          </View>
        );
        return rowJSx
    }
    renderView() {
        const { req } = this.state;
        if (this.loadingInformation == false) {
            return <PacmanIndicator size={100} />
        } else {
            return (
                <View>
                    <View colors={[, '#1da2c6', '#1695b7']}
                        style={{ backgroundColor: '#98cbe4', padding: 15, alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, color: 'white', }}>Notification</Text>
                        <View style={{position:'absolute', marginLeft: width / 18, marginTop:width / 35 ,alignSelf:'flex-start'}}>
                            <Button transparent onPress={() => this.props.navigation.navigate('UserProfileScreen')}>
                                        <Image
                                                style={{ width: width / 15, height: width / 15 }}
                                                source={require('../files/back.png')}
                                            />
                            </Button>
                        </View>
                    
                    
                    </View>
                    <FlatList
                        data={req}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={data => this.renderItem(data)}
                    />

                 </View>
                
            );
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
        flexDirection:'row'
    },    
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        marginRight: 10
    }
});

