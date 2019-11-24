const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.createRandomGame = functions.region('europe-west1').database
.ref('/waitingRoom')
.onUpdate((snapshot, context) => {

    console.log('snapshot')
    console.log(snapshot)
    
    console.log('snaposhot.after.val')
    console.log(snapshot.after.val())

    console.log('snapshot.toJson')
    console.log(snapshot.after.toJSON())

    console.log('snaposhot.numChildren()')
    console.log(snapshot.after.numChildren())


    console.log('snaposhot.hasChild')
    console.log(snapshot.after.hasChild('fxco4umom8XDKprM7aANkRObX8j2'))

    const playersInWatingRoom = snaposhot.after.numChildren()
    
    if(playersInWatingRoom >= 2){

    const player1 =
    const player2 =

    }
/*
    const playersInWatingRoom = snapshot.ref.parent.once('value', (datasnapshot) => {
        const numberOfChildren = datasnapshot.numChildren()
        return numberOfChildren
    });
    console.log(playersInWatingRoom)


    const player = snapshot.val()
    const ID = player.user
 
    return snapshot.ref.parent.parent.child('games').child('game_1').set({
                player1: ID,
                player2: 'eeeh chissà come si fa',
            });
            


  return snapshot.ref.parent.once('value').then((datasnapshot) => {
        const numberOfChildren = datasnapshot.numChildren()
        return numberOfChildren
    }).then((usersInWaitingRoom) => {
        console.log(usersInWaitingRoom)    
        if(usersInWaitingRoom > 100)
          // Do Something
        else
          // Do Something Else
    }); 


*/

});
