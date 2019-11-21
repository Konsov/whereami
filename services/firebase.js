// Config file
import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyD0ylq1lq09wMlsr2GEgbfhj_9NKkrJgRw",
    authDomain: "fir-chat-3d414.firebaseapp.com",
    databaseURL: "https://fir-chat-3d414.firebaseio.com",
    projectId: "fir-chat-3d414",
    storageBucket: "fir-chat-3d414.appspot.com",
    messagingSenderId: "543229345691",
    appId: "1:543229345691:web:092028e0969cd9f25f6b3e",
    measurementId: "G-0J0W0JKY1J"
};

 const admin = require('firebase-admin');
 admin.initializeApp();

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
