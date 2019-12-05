const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var randomPointsOnPolygon = require('random-points-on-polygon');
var turf = require('@turf/turf');

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


                        snapWaitingRoom.ref.parent.child('Games').child(playerOne + playerTwo).set({
                            player1:playerOne, 
                            player2: playerTwo,
                            round: 0
                        });

                        snapWaitingRoom.ref.parent.child('Games').child(playerOne + playerTwo).update({
                            round: 1
                        });

                        return null;



                    } 
                }
            }


    }).catch(err => {
        console.log('Error to get WaitingRoom: ' + err)
    });

});

exports.addCoordinate = functions.region('europe-west1').database
.ref('/Games/{gameID}/round')
.onUpdate((snaposhot, context) => {

    var nRound = snaposhot.after.val()
    
    if(nRound == 6){
        snaposhot.after.ref.parent.remove()
        return null
    }

    var continent = turf.polygon([[[366.2402344, 43.4066368], [368.7011719, 44.4825215], [376.1059570, 39.4204083], [377.1826172, 41.0309976],[373.2055664, 42.5691892], [371.7553711, 45.3230230], [377.9296875, 52.3645201], [366.0205078, 52.7519573],
    [361.6479492, 49.7975975],
    [359.1430664, 44.0102669],
    [366.2402344, 43.4066368]]]);

    var points = randomPointsOnPolygon(1, continent);
    
    var x = points[0]["geometry"]["coordinates"][1];
    var y = points[0]["geometry"]["coordinates"][0];
    

    return snaposhot.after.ref.parent.child('coordinates').set({
        latitude: x, 
        longitude: y
        }) 
  
});

// function getRandomContinent() {
    
//     var randomCoordinate = Math.floor(Math.random()*7)

//     switch (randomCoordinate) {
//         case 0:
//             return turf.multiPolygon(ASIA);
//         case 1:
//             return turf.multiPolygon(NORD_AMERICA);
//         case 2:
//             return turf.multiPolygon(SUD_AMERICA);
//         case 3:
//             return turf.multiPolygon(AFRICA);
//         case 4:
//             return turf.multiPolygon(OCEANIA);
//         case 5:
//             return turf.multiPolygon(AUSTRALIA);
//         case 6:
//             return turf.multiPolygon(EUROPE);
//         default:
//             return null;
//     }
// }
