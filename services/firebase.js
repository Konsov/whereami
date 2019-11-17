// Config file
import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyAGYdr7LvlyGzDHZTs0VEzuD1gmGOvIAPI",
    authDomain: "whereami-a1509.firebaseapp.com",
    databaseURL: "https://whereami-a1509.firebaseio.com",
    projectId: "whereami-a1509",
    storageBucket: "whereami-a1509.appspot.com",
    messagingSenderId: "598344557393",
    appId: "1:598344557393:web:929ad11caf401a5aa2a970",
    measurementId: "G-3MK8RNF0BG"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
