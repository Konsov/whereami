const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);




exports.createRandomGame = functions.region('europe-west1').database
.ref('/waitingRoom/{userID}')
.onCreate((snaposhot, context) => {

    const playerOne = context.params.userID

    return snaposhot.ref.parent.once('value').then(snapWaitingRoom => {
       
        var playersInWaitingRoom = snapWaitingRoom.toJSON()
        console.log('Players in Wating Room: ', playersInWaitingRoom)

        var numberPlayersInWatingRoom = snapWaitingRoom.numChildren()
        console.log('Numbers Player In Wating Room ' + numberPlayersInWatingRoom)
        

            if (numberPlayersInWatingRoom < 2) {
                return null
            } else {

                for (var player in playersInWaitingRoom) {
                 
                    if (player != playerOne) {
                        const playerTwo = player
                        
                        snapWaitingRoom.ref.child(playerOne).remove().then(function() {
                            console.log(`${playerOne} removed from the waiting room`)
                          })
                          .catch(function(error) {
                            console.log(`Removed of ${playerOne} failed:` + error.message)
                          });
            
                        snapWaitingRoom.ref.child(playerTwo).remove().then(function() {
                            console.log(`${playerTwo} removed from the waiting room`)
                          })
                          .catch(function(error) {
                            console.log(`Removed of ${playerTwo} failed:` + error.message)
                          });


                        return snapWaitingRoom.ref.parent.child('Games').child(playerOne + playerTwo).set({
                            player1:playerOne, 
                            player2: playerTwo,
                            coordinates: ''
                        });

                    } 
                }
            }


    }).catch(err => {
        console.log('Error to get WaitingRoom: ' + err)
    });

});
