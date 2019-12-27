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
    View
} from 'react-native';

import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";



export default class NotificationScreen extends Component {

    state = {
        req: [],
        online: [],
        loadingInformation: false,
        username: '',
        profPic: '',
        loadOnl: false,
        val: ''

    }

    async getMembersListFromDB(val) {
        return firebase.database().ref('/users').child(`${this.state.req[val]['uid']}`).child('online').once('value')
    }

    componentDidMount() {
        this.loadInfo();

    }

    push() {
        let req = [...this.state.req];

        // Add item to it

        for (var val in req){
            req[val]['online'] = this.state.val
        }

        // Set state
        this.setState({ req });
    }

    isOnline() {
        var on = [];
        var k;
        firebase.database().ref('/users').once('value').then(snap => {

            for (var val in this.state.req) {
                this.getMembersListFromDB(val).then(snapshot => {
                    k = snapshot.val()
                    on.push(snapshot.val())
                    this.setState({
                        val: k
                    })
                }).then(
                    setTimeout(() => {this.push()}, 2000)
                )
            }
        }).then(
            this.setState({
                loadingInformation: true
            })
        )
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
                            <Title>Friend List</Title>
                        </Body>
                        <Right />
                    </Header>

                    <Content>
                        <List>
                            {this.state.req.map((data, i) => (

                                <ListItem avatar key={i}>
                                    <Left>
                                        <Thumbnail small source={{ uri: data.img }} />
                                        {data.online == true ? <Badge style={{ backgroundColor: 'green', width: 10,height:10, right: 10, top:25 }}>
                                        </Badge>: console.log(this.state.req) }
                                    </Left>
                                    <Body>
                                        <Text>{data.name}</Text>
                                    </Body>
                                    <Right style={{ flexDirection: 'row' }}>
                                    {data.online == true ? <AwesomeButton
                                            type="primary"
                                            height={25}
                                            style={styles.button}
                                            onPress={() => this.confirmReq(data, i)}
                                        >➤
                                        </AwesomeButton>: <AwesomeButton
                                            type="primary"
                                            height={25}
                                            style={styles.button}
                                            disabled
                                            onPress={() => this.confirmReq(data, i)}
                                        >➤
                                        </AwesomeButton> }

                                        
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

