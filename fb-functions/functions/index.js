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

                        snapWaitingRoom.ref.child(playerOne).remove().then(function () {
                            console.log(`${playerOne} removed from the waiting room`)
                        })
                            .catch(function (error) {
                                console.log(`Removed of ${playerOne} failed:` + error.message)
                            });

                        snapWaitingRoom.ref.child(playerTwo).remove().then(function () {
                            console.log(`${playerTwo} removed from the waiting room`)
                        })
                            .catch(function (error) {
                                console.log(`Removed of ${playerTwo} failed:` + error.message)
                            });


                        snapWaitingRoom.ref.parent.child('Games').child(playerOne + playerTwo).set({
                            player1: playerOne,
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

        if (snaposhot.after.ref.parent.child('player2') == '') {
        
            if (nRound == 6) {
                snaposhot.after.ref.parent.remove()
                return null
            }

            var continent = turf.polygon([[[17.7187479,54.0782395],[12.6210916,53.4028628],[6.908201, 52.6633491],
                [0.8437479,49.1193822],[ 1.1074197,43.6100721],[6.1171854,44.1797656],[11.9179666,45.4878456],
                [13.4121072,46.7060361],[17.9824197,43.9904734],[17.7187479,54.0782395]]]);


            var points = randomPointsOnPolygon(1, continent);

            var x = points[0]["geometry"]["coordinates"][1];
            var y = points[0]["geometry"]["coordinates"][0];


            return snaposhot.after.ref.parent.child('coordinates').set({
                latitude: x,
                longitude: y
            })
        } else {

            if (nRound == 3 | nRound == 5 | nRound == 7 ) {
                return null
            } else if (nRound == 9) {
                snaposhot.after.ref.parent.remove()
                return null
            } else {
                var continent = turf.polygon([[[17.7187479,54.0782395],[12.6210916,53.4028628],[6.908201, 52.6633491],
                    [0.8437479,49.1193822],[ 1.1074197,43.6100721],[6.1171854,44.1797656],[11.9179666,45.4878456],
                    [13.4121072,46.7060361],[17.9824197,43.9904734],[17.7187479,54.0782395]]]);
    
                var points = randomPointsOnPolygon(1, continent);
    
                var x = points[0]["geometry"]["coordinates"][1];
                var y = points[0]["geometry"]["coordinates"][0];
    
    
                return snaposhot.after.ref.parent.child('coordinates').set({
                    latitude: x,
                    longitude: y
                })
            }
        }



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
