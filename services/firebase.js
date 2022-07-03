// Config file
import * as firebase from "firebase";

const config = {
    //qui api e config database, cancellato perchè pubblico su git
};


export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
