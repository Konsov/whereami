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
    Image,
    Dimensions
} from 'react-native';
import Modal from 'react-native-modal'

import firebase from '../services/firebase';
import { PacmanIndicator } from 'react-native-indicators';


const { width } = Dimensions.get('window');

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

        }).then(setTimeout(() => {this.sortArray() }, 250))
    }

    sortArray() {
        var list = this.state.req;
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
                                    style={{ width: width / 19.63, height: width / 19.63 }}
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
                                    <Body style={{ flexDirection: "row" }}>
                                        <Text adjustsFontSizeToFit numberOfLines={1} style={{ fontSize:width / 25, marginTop:width / 32.7 }}>{data.name}</Text>
                                        <Text></Text>
                                    </Body>
                                    <Body>
                                        <Text style={{ marginLeft:width / 13.09, marginTop:width / 32.7, fontSize:width / 25}}>{data.avg}</Text>
                                       
                    
                                    </Body>
                                    <Right style={{marginTop:-(width / 39.2), flexDirection: 'row' }}>
                                    
                                        {i == 0 ? <Image
                                        style={{width: width / 9.81,height: width / 9.81}}
                                        source={require('../files/gold-medal.png')}/>
                                     : i == 1 ?
                                    <Image
                                    style={{width: width / 9.81,height: width / 9.81}}
                                    source={require('../files/silver-medal.png')}/>
                                    : i == 2 ? <Image
                                    style={{width: width / 9.81,height: width / 9.81}}
                                    source={require('../files/bronze-medal.png')}/>
                                        : <Text style={{marginRight: width / 24.54}}>{i}</Text>}

                                            
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
                            style={{left: width / 78.5}}
                            ><Image
                                style={{width: width / 7.85,height: width / 7.85}}
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
        padding: width / 17.85,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width / 98.18,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: width / 19.6,
        marginBottom: width / 32.7,
    }
});

