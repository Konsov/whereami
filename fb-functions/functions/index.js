const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.createRandomGame = functions.region('europe-west1').database
.ref('/waitingRoom/{playerID}')
.onCreate((snapshot, context) => {
   
   console.log(context.params.playerID)
  
   const player = snapshot.val()
   const ID = player.user
 
   return snapshot.ref.parent.parent.child('games').child('game_1').set({
                player1: ID,
                player2: 'eeeh chissà come si fa',
            });


});
