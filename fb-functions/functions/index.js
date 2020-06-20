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
            console.log('dasda', userRecord)
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

            admin.messaging().send(message);
            

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    })


exports.createRandomGame = functions.region('europe-west1').database
    .ref('/waitingRoom/{userID}')
    .onCreate((snaposhot, context) => {

        const playerOne = context.params.userID
        console.log('playerOne:dasda ', playerOne)

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


                        snapWaitingRoom.ref.parent.child('Games').child(playerOne + playerTwo).set({
                            player1: {
                                user: playerOne,
                                username: playersInWaitingRoom[playerOne]['username'],
                                score: 0
                            },
                            player2: {
                                user: playerTwo,
                                username: playersInWaitingRoom[playerTwo]['username'],
                                score: 0
                            },
                            finished: false,
                            type:'multiplayer'
                        });

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


                        return null;

                    }
                }
            }


        }).catch(err => {
            console.log('Error to get WaitingRoom: ' + err)
        });

    });

exports.updateImgProfile = functions.region('europe-west1').database
    .ref('/users/{uid}/userpic')
    .onUpdate((snapshot, context) => {
        const uid = context.params.uid;
        return snapshot.after.ref.parent.once('value').then(val => {
            var user = val.toJSON();
            var img = user['userpic'];
            admin.database().ref('/users').once('value').then(snap => {
                
                                
                var profile = snap.toJSON();

                for (users in profile){
                    for (var prof in profile[users]['friend']) {
                        if (prof == uid){
                            admin.database().ref(`/users/${users}/friend/${uid}`).update({
                                img: img
                            })
                        }
                    }
                }
            })
        })
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

                snapGame.ref.parent.parent.child('users').child(playerTwoID).once('value').then(snpaStats => {
                    var badge = []
                    var snapStatsJson = snpaStats.toJSON()
                    var maxScore = snapStatsJson['statistics']['maxScore']
                    var avgScore = snapStatsJson['statistics']['avgScore']
                    var nGames = snapStatsJson['statistics']['nGames']
                    var nGames_multi = snapStatsJson['statistics']['nGames_multi']
                    var win = snapStatsJson['statistics']['win']
                    var win_in_row = snapStatsJson['statistics']['win_in_row']
                    
                    if(snapGameJson['winner'] == playerTwoID){
                        snpaStats.ref.child('statistics').update({ win: win + 1, win_in_row:win_in_row + 1 })
                        if (win_in_row + 1 == 5 && snapStatsJson['statistics']['badge']['fire'] == false){
                            badge.push('fire')
                        }
                        if (win + 1 == 5){
                            badge.push('bronze_2')
                        } else if (win + 1 == 20){
                            badge.push('silver_2')
                        }else if (win + 1 == 50){
                            badge.push('gold_2')
                        }

                    } else {
                        snpaStats.ref.child('statistics').update({ win_in_row:0 })
                    }

                    if (nGames_multi + 1 == 5){
                        badge.push('game_1')
                    } else if (nGames_multi + 1 == 20){
                        badge.push('game_2')
                    }else if (nGames_multi + 1 == 50){
                        badge.push('game_3')
                    }
                    snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1 })

                    if (avgScore == 0) {
                        snpaStats.ref.child('statistics').update({ avgScore: playerTwoScore })
                    } else {
                        var newAvg = (avgScore + playerTwoScore) / 2
                        snpaStats.ref.child('statistics').update({ avgScore: newAvg })
                    }

                    if (playerTwoScore > maxScore) {
                        snpaStats.ref.child('statistics').update({ maxScore: playerTwoScore })
                    }

                    if (typeof badge !== 'undefined' && badge.length > 0) {
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
                                        "title": `New Badge`,
                                        "body": `badge ${badge.join()}`,
                                        "event_time": (new Date()).toISOString,
                                        "notification_priority": "PRIORITY_HIGH",
                                        "default_sound": true,
                                        "default_vibrate_timings": true,
                                        "default_light_settings": true,
                                        "visibility": "PUBLIC"
                                        
                                        
                                    }
                                },
                            
                                // Union field target can be only one of the following:
                                "token": snapStatsJson['token'],
                                // End of list of possible types for union field target.
                            
                        }
            
                        admin.messaging().send(message);
                    }

                })
            }

            snapGame.ref.parent.parent.child('users').child(playerOneID).once('value').then(snpaStats => {
                var badge = []
                var snapStatsJson = snpaStats.toJSON()
                var maxScore = snapStatsJson['statistics']['maxScore']
                var avgScore = snapStatsJson['statistics']['avgScore']
                var nGames = snapStatsJson['statistics']['nGames']
                var nGames_sing = snapStatsJson['statistics']['nGames_sing']
                var nGames_multi = snapStatsJson['statistics']['nGames_multi']
                var win = snapStatsJson['statistics']['win']
                var win_in_row = snapStatsJson['statistics']['win_in_row']
                if(snapGameJson['winner'] != null){
                    if (snapGameJson['winner'] == playerOneID){
                        snpaStats.ref.child('statistics').update({ win: win + 1, win_in_row:win_in_row + 1  })
                        if (win_in_row + 1 == 5 && snapStatsJson['statistics']['badge']['fire'] == false){
                            badge.push('fire')
                        }
                    } else {
                        snpaStats.ref.child('statistics').update({ win_in_row:0 })
                    }
                    if (nGames_multi + 1 == 5){
                        badge.push('game_1')
                    } else if (nGames_multi + 1 == 20){
                        badge.push('game_2')
                    } else if (nGames_multi + 1 == 50){
                        badge.push('game_3')
                    }
                    snpaStats.ref.child('statistics').update({ nGames_multi: nGames_multi + 1 })
                } else {
                    if (nGames_sing + 1 == 5){
                        badge.push('bronze')
                    } else if (nGames_sing + 1 == 20){
                        badge.push('silver')
                    }else if (nGames_sing + 1 == 50){
                        badge.push('gold')
                    }
                    snpaStats.ref.child('statistics').update({ nGames_sing: nGames_sing + 1 })
                }

                snpaStats.ref.child('statistics').update({ nGames: nGames + 1 })

                if (avgScore == 0) {
                    snpaStats.ref.child('statistics').update({ avgScore: playerOneScore })
                } else {
                    var newAvg = (avgScore + playerOneScore) / 2
                    snpaStats.ref.child('statistics').update({ avgScore: newAvg })
                }

                if (playerOneScore > maxScore) {
                    snpaStats.ref.child('statistics').update({ maxScore: playerOneScore })
                }

                if (typeof badge !== 'undefined' && badge.length > 0) {
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
                                "title": `New Badge`,
                                "body": `badge ${badge.join()}`,
                                "event_time": (new Date()).toISOString,
                                "notification_priority": "PRIORITY_HIGH",
                                "default_sound": true,
                                "default_vibrate_timings": true,
                                "default_light_settings": true,
                                "visibility": "PUBLIC"
                                
                                
                            }
                        },
                    
                        // Union field target can be only one of the following:
                        "token": snapStatsJson['token'],
                        // End of list of possible types for union field target.
                    
                }
    
                admin.messaging().send(message);
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

        return snaposhot.ref.child('roundCoordinates').set({
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
