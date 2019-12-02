import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import firebase from '../services/firebase';

export default class UserProfileScreen extends Component {
    
    render() {
        const user = firebase.auth().currentUser;
        console.log(user)
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image style={styles.avatar}
                        source={{ uri: user.photoURL }} />
                    <Text style={styles.name}>{user.displayName} </Text>
                    <Text style={styles.userInfo}>{user.email} </Text>
                </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <Image style={styles.icon} source={{ uri: "https://img.icons8.com/material-rounded/24/000000/home.png" }} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.info} onPress={() => { this.props.navigation.goBack() }}>Home</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
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
    },
    name: {
        fontSize: 22,
        color: "#000000",
        fontWeight: '600',
    },
    userInfo: {
        fontSize: 16,
        color: "#778899",
        fontWeight: '600',
    },
    body: {
        backgroundColor: "#778899",
        height: 500,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
    },
    infoContent: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 5,
        paddingTop: 3
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