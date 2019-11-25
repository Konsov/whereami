const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);




exports.createRandomGame = functions.region('europe-west1').database
    .ref('/waitingRoom/{userID}')
    .onCreate((snaposhot, context) => {

        const ID = context.params.userID


        return snaposhot.ref.parent.once('value').then(res => {

            console.log('numChildren')
            console.log(res.numChildren())

            if (res.numChildren() < 2) {
                return null
            } else {

                for (var c in res.toJSON()) {
                    if (c != ID) {
                        const ID2 = c
                        res.ref.child(ID).remove().then(function() {
                            console.log("Remove Player 1.")
                          })
                          .catch(function(error) {
                            console.log("Remove failed: " + error.message)
                          });
            
                        res.ref.child(ID2).remove().then(function() {
                            console.log("Remove Player 2.")
                          })
                          .catch(function(error) {
                            console.log("Remove failed: " + error.message)
                          });
                        return res.ref.parent.child('Games').child(ID + ID2).set({
                            player1:ID, 
                            player2: ID2
                        });

                    } 
                }
            }


        }).catch(err => {

        });

        // const uppercase = original.toUpperCase();




        //const playersInWatingRoom = snaposhot.numChildren()


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
