const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var randomPointsOnPolygon = require('random-points-on-polygon');
var turf = require('@turf/turf');

exports.sendFriendRequest = functions.region('europe-west1').database.
    ref('users/{uid}/request/{uid2}')
    .onCreate((snapshot, context) => {
        const uuid = context.params.uid;
        var user = "";
        var img = "";
        console.log('User to send notification', uuid);
        admin.auth().getUser(context.params.uid2).then(function(userRecord){
            console.log(userRecord)
            user = userRecord.displayName;
            img = userRecord.photoURL;
            snapshot.ref.update({
                img: userRecord.photoURL
            })
        })

        var body = user + " want to be your friend";
       
        var ref = admin.database().ref(`users/${uuid}/token`);
        return ref.once("value", function (snapshot) {
            const message = {
                
                    "name": "prova",
                    "data": {
                      "data1": "data1",
                      
                    },
                    "notification": {
                        
                            "title": "notif_title",
                            "body": "notif_body"
                          
                    },
                    "android": {

                        "notification": {
                            "title": `You received a friend request`,
                            "body": `${user} want to be your friend`,
                            "event_time": (new Date()).toISOString,
                            "notification_priority": "PRIORITY_HIGH",
                            "default_sound": true,
                            "default_vibrate_timings": true,
                            "default_light_settings": true,
                            "visibility": "PUBLIC"
                            
                            
                        }
                    },
                  
                    // Union field target can be only one of the following:
                    "token": snapshot.val(),
                    // End of list of possible types for union field target.
                  
            }

            const payload = {
                notification: {
                    title: 'You have a friend request!',
                    body: 'Tap here to check it out!'
                }  
            };
            setTimeout(function(){admin.messaging().send(message) }, 5000);
            

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    })


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
                            player1: {
                                user: playerOne,
                                score: 0
                            },
                            player2: {
                                user: playerTwo,
                                score: 0
                            },
                            finished: false,
                            type:'multiplayer'
                        });

                        return null;

                    }
                }
            }


        }).catch(err => {
            console.log('Error to get WaitingRoom: ' + err)
        });

    });


exports.delGameUpStats = functions.region('europe-west1').database
    .ref('/Games/{gameID}/finished')
    .onUpdate((snapshot, context) => {

        return snapshot.after.ref.parent.once('value').then(snapGame => {

            var snapGameJson = snapGame.toJSON();
            var playerOneID = snapGameJson['player1']['user']
            var playerOneScore = snapGameJson['player1']['score']

            if (snapGame.child('player2').exists()) {
                var playerTwoID = snapGameJson['player2']['user']
                var playerTwoScore = snapGameJson['player2']['score']

                snapGame.ref.parent.parent.child('users').child(playerTwoID).child('statistics').once('value').then(snpaStats => {
                    var snapStatsJson = snpaStats.toJSON()
                    var maxScore = snapStatsJson['maxScore']
                    var avgScore = snapStatsJson['avgScore']
                    var nGames = snapStatsJson['nGames']

                    snpaStats.ref.update({ nGames: nGames + 1 })

                    if (avgScore == 0) {
                        snpaStats.ref.update({ avgScore: playerTwoScore })
                    } else {
                        var newAvg = (avgScore + playerTwoScore) / 2
                        snpaStats.ref.update({ avgScore: newAvg })
                    }

                    if (playerTwoScore > maxScore) {
                        snpaStats.ref.update({ maxScore: playerTwoScore })
                    }

                })
            }

            snapGame.ref.parent.parent.child('users').child(playerOneID).child('statistics').once('value').then(snpaStats => {

                var snapStatsJson = snpaStats.toJSON()
                var maxScore = snapStatsJson['maxScore']
                var avgScore = snapStatsJson['avgScore']
                var nGames = snapStatsJson['nGames']

                snpaStats.ref.update({ nGames: nGames + 1 })

                if (avgScore == 0) {
                    snpaStats.ref.update({ avgScore: playerOneScore })
                } else {
                    var newAvg = (avgScore + playerOneScore) / 2
                    snpaStats.ref.update({ avgScore: newAvg })
                }

                if (playerOneScore > maxScore) {
                    snpaStats.ref.update({ maxScore: playerOneScore })
                }

            }).then(snapshot.after.ref.parent.remove())

        })

    });



exports.addCoordinate = functions.region('europe-west1').database
    .ref('/Games/{gameID}')
    .onCreate((snaposhot, context) => {

        var continent = turf.polygon([
            [
                [
                    -0.4833984,
                    43.8362074
                ],
                [
                    8.7890625,
                    44.872865
                ],
                [
                    16.2158203,
                    39.1329535
                ],
                [
                    17.4023438,
                    40.7164341
                ],
                [
                    11.8212891,
                    45.6460001
                ],
                [
                    19.9951172,
                    42.1655077
                ],
                [
                    28.7402344,
                    46.5900715
                ],
                [
                    21.0498047,
                    54.8251734
                ],
                [
                    11.7773438,
                    53.8518914
                ],
                [
                    10.9423828,
                    56.8957635
                ],
                [
                    7.8662109,
                    56.4855996
                ],
                [
                    7.9980469,
                    54.0844901
                ],
                [
                    -3.9990234,
                    48.1080718
                ],
                [
                    -0.4833984,
                    43.8362074
                ]
            ]
        ]);

        var points = randomPointsOnPolygon(5, continent);

        var x5= points[0]["geometry"]["coordinates"][1];
        var y5= points[0]["geometry"]["coordinates"][0];
       
        var x1 = points[1]["geometry"]["coordinates"][1];
        var y1= points[1]["geometry"]["coordinates"][0];
        
        var x2 = points[2]["geometry"]["coordinates"][1];
        var y2= points[2]["geometry"]["coordinates"][0];

        var x3 = points[3]["geometry"]["coordinates"][1];
        var y3= points[3]["geometry"]["coordinates"][0];

        var x4 = points[4]["geometry"]["coordinates"][1];
        var y4= points[4]["geometry"]["coordinates"][0];

        return snaposhot.ref.child('RoundCoordinates').set({
            round_1: {
                latitude: x1,
                longitude: y1
            },
            round_2: {
                latitude: x2,
                longitude: y2
            },
            round_3: {
                latitude: x3,
                longitude: y3
            },
            round_5: {
                latitude: x5,
                longitude: y5
            },
            round_4: {
                latitude: x4,
                longitude: y4
            },
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
