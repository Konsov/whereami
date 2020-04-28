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
    View,
    TouchableHighlight,
    Image
} from 'react-native';
import Modal from 'react-native-modal'

import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';
import AwesomeButton from "react-native-really-awesome-button/src/themes/rick";

var v = 0;

export default class LeaderScreen extends Component {

    state = {
        req: [],
        online: [],
        loadingInformation: false,
        username: '',
        profPic: '',
        loadOnl: false,
        val: '',
        modalVisible: false,
        playreq: ''

    }

    async getMembersListFromDB(val) {
        return firebase.database().ref('/users').child(`${this.state.req[val]['uid']}`).child('online').once('value')
    }

    componentDidMount() {

        this.loadInfo();

    }

    push() {
        let req = [...this.state.req];

        for (var val in req) {
            if (v == val)
                req[val]['online'] = this.state.val
        }

        v = v + 1;
        this.setState({ req });
    }


    loadInfo() {
        var req = [];
        firebase.database().ref('/users').once('value').then(snapshot => {
            var profile = snapshot.toJSON();

            for (var val in profile) {
                var name = profile[val]['username'];
                var im = profile[val]['userpic'];
                var avg = profile[val]['statistics']['avgScore'];
                var max = profile[val]['statistics']['maxScore'];
                req.push({ name: name, img: im, avg: (avg).toFixed(), max: max.toFixed() })
            }

            this.setState({
                req: req
            })

        }).then(setTimeout(() => {this.sortArray() }, 150))
    }

    sortArray() {
        var list = this.state.req;
        console.log(this.state.req);
        var mapped = list.map(function(el, i) {
            return { index: i, value: el.avg };
        })
        mapped.sort(function(a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            return 0;
        });
        var result = mapped.map(function(el){
            return list[el.index];
        });
        console.log(mapped);

        this.setState({
            req: result,
            loadingInformation:true
        })
    }

    renderView() {
        if (this.state.loadingInformation == false) {
            return <PacmanIndicator size={100} />
        } else {
            return (
                <Container style={styles.container}>
                    <Header style={{ backgroundColor: "#778899" }}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.navigate('UserProfileScreen')}>
                            <Image
                                    style={{ width: 20, height: 20 }}
                                    source={require('../files/back.png')}
                                />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Leader Board</Title>
                        </Body>
                        <Right />
                    </Header>

                    <Content style = {{backgroundColor: "#DCDCDC"}}>
                        <List>
                            
                            {this.state.req.map((data, i) => (

                                <ListItem avatar key={i}>
                                    <Left>
                                        <Thumbnail small source={{ uri: data.img }} />
                                    </Left>
                                    <Body>
                                        <Text style={{ marginTop:12 }}>{data.name}</Text>
                                        <Text></Text>
                                    </Body>
                                    <Body>
                                        <Text style={{ marginLeft:30, marginTop:12}}>{data.avg}</Text>
                                        <Text></Text>
                    
                                    </Body>
                                    <Right style={{marginTop:-10, flexDirection: 'row' }}>
                                    
                                        {i == 0 ? <Image
                                        style={{width: 40,height: 40}}
                                        source={require('../files/gold-medal.png')}/>
                                     : i == 1 ?
                                    <Image
                                    style={{width: 40,height: 40}}
                                    source={require('../files/silver-medal.png')}/>
                                    : i == 2 ? <Image
                                    style={{width: 40,height: 40}}
                                    source={require('../files/bronze-medal.png')}/>
                                        : <Text style={{marginRight: 16, marginBottom:15}}>{i}</Text>}

                                            
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
                <Modal
                    testID={'modal'}
                    isVisible={this.state.modalVisible}
                    backdropColor="#B4B3DB"
                    backdropOpacity={0.8}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}>
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>Waiting for the other player response...</Text>
                        <View style={{ flexDirection: 'row' }}>
                        <TouchableHighlight
                            onPress={() => this.undoReq()}
                            underlayColor="transparent"
                            activeOpacity= {0.7}  
                            style={{left: 5}}
                            ><Image
                                style={{width: 50,height: 50}}
                                source={require('../files/error.png')}/>
                        </TouchableHighlight>   

                        </View>
                    </View>
                </Modal>
            </View>
        )


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    }
});

