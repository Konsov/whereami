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
    Image 
} from 'react-native';

import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

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
    renderView() {
        if (this.loadingInformation == false) {
            return <PacmanIndicator size={100} />
        } else {
            return (
                <Container style={styles.container}>
                    <Header style = {{backgroundColor: "#778899"}}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.navigate('UserProfileScreen')}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ fontFamily: "pixel_font" }}>Notification</Title>
                        </Body>
                        <Right />
                    </Header>

                    <Content style = {{backgroundColor: "#DCDCDC"}}>
                        <List>
                            {this.state.req.map((data, i) => (
                                
                                <ListItem avatar key={i}>
                                    <Left>
                                        <Thumbnail small source={{uri: data.img}}/>
                                    </Left>
                                    <Body>
                                        <Text style={{ fontFamily: "pixel_font" }}>{data.name} </Text>
                                        <Text numberOfLines={1} note style={{ marginTop: 12,fontFamily: "pixel_font",fontSize: 12 }}>
                                            Has sent you a friend request
                                        </Text>
                                    </Body>
                                    <Right style={{flexDirection:'row'}}>
                                    <TouchableHighlight
                                        onPress={() => this.confirmReq(data,i)}
                                        underlayColor="transparent"
                                        activeOpacity= {0.7}  
                                        ><Image
                                        style={{width: 40,height: 40}}
                                        source={require('../files/confermation.png')}/>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        onPress={() => this.denyReq(data,i)}
                                        underlayColor="transparent"
                                        activeOpacity= {0.7}  
                                        style={{left: 5}}
                                        ><Image
                                        style={{width: 40,height: 40, left: 5}}
                                        source={require('../files/negation.png')}/>
                                    </TouchableHighlight>
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
            </View>
        )


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

