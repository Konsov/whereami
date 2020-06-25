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
                                score: 0,
                                badge: {
                                    center: false,
                                    time: false
                                }
                            },
                            player2: {
                                user: playerTwo,
                                username: playersInWaitingRoom[playerTwo]['username'],
                                score: 0,
                                badge: {
                                    center: false,
                                    time: false
                                }
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
            snapshot.after.ref.parent.remove()
            var snapGameJson = snapGame.toJSON();
            var playerOneID = snapGameJson['player1']['user']
            var playerOneScore = snapGameJson['player1']['score']
            var playerOneBadge = snapGameJson['player1']['badge']

            if (snapGame.child('player2').exists()) {
                var playerTwoID = snapGameJson['player2']['user']
                var playerTwoScore = snapGameJson['player2']['score']
                var playerTwoBadge = snapGameJson['player2']['badge']

                snapGame.ref.parent.parent.child('users').child(playerTwoID).once('value').then(snpaStats => {
                    var badge = []
                    var snapStatsJson = snpaStats.toJSON()
                    var maxScore = snapStatsJson['statistics']['maxScore']
                    var avgScore = snapStatsJson['statistics']['avgScore']
                    var nGames = snapStatsJson['statistics']['nGames']
                    var nGames_multi = snapStatsJson['statistics']['nGames_multi']
                    var win = snapStatsJson['statistics']['win']
                    var win_in_row = snapStatsJson['statistics']['win_in_row']
                    var w = false;
                    var m = false;
                    var c = false;
                    var f = false;
                    var avg= 0;
                    if(snapGameJson['winner'] == playerTwoID){
                        w= true;
                        if (win_in_row + 1 == 5 && snapStatsJson['statistics']['badge']['fire'] == false){
                            f = true;
                            badge.push('fire')
                        }
                        if (win + 1 == 5){
                            badge.push('bronze_2')
                        } else if (win + 1 == 20){
                            badge.push('silver_2')
                        }else if (win + 1 == 50){
                            badge.push('gold_2')
                        }

                    } 

                    if (playerTwoBadge['center'] == true && snapStatsJson['statistics']['badge']['center'] == false) {
                        c = true;
                        badge.push('center')
                    }

                    if (nGames_multi + 1 == 5){
                        badge.push('game_1')
                    } else if (nGames_multi + 1 == 20){
                        badge.push('game_2')
                    }else if (nGames_multi + 1 == 50){
                        badge.push('game_3')
                    }

                    if (avgScore != 0) {
                        avg = (avgScore + playerTwoScore) / 2;
                    }

                    if (playerTwoScore > maxScore) {
                        m = true;
                    }

                    if (w & !m) {
                        snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1, avgScore: avg,
                        win: win + 1, win_in_row:win_in_row + 1 })
                    } else if (!w & m) {
                        snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1, avgScore: avg,
                        win_in_row:0, maxScore: playerTwoScore})
                    } else if (!w & !m) {
                        snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1, avgScore: avg,
                        win_in_row:0})
                    } else {
                        snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1, avgScore: avg,
                        win_in_row:win_in_row + 1, maxScore: playerTwoScore, win: win + 1})
                    }

                    if (!f & !c){

                    } else if (f & !c) {
                        snpaStats.ref.child('statistics').child('badge').update({ fire:true})
                    } else if (!f & c) {
                        snpaStats.ref.child('statistics').child('badge').update({ center:true})
                    } else {
                        snpaStats.ref.child('statistics').child('badge').update({ fire:true, center:true})

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

                var w = false;
                var max = false;
                var c = false;
                var f = false;
                var m = false;
                var avg= 0;

                if(snapGameJson['winner'] != null){
                    if (snapGameJson['winner'] == playerOneID){
                        w= true;
                        if (win_in_row + 1 == 5 && snapStatsJson['statistics']['badge']['fire'] == false){
                            f= true;
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
                    m= true;
                } else {
                    if (nGames_sing + 1 == 5){
                        badge.push('bronze')
                    } else if (nGames_sing + 1 == 20){
                        badge.push('silver')
                    }else if (nGames_sing + 1 == 50){
                        badge.push('gold')
                    }
                }

                if (playerOneBadge['center'] == true && snapStatsJson['statistics']['badge']['center'] == false) {
                    c = true;
                    badge.push('center')
                }

                if (avgScore != 0) {
                    avg = (avgScore + playerOneScore) / 2;
                }

                if (playerOneScore > maxScore) {
                    max = true;
                }

                if (m) {                    
                    if (w & !max) {
                        snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1, avgScore: avg,
                        win: win + 1, win_in_row:win_in_row + 1 })
                    } else if (!w & max) {
                            snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1, avgScore: avg,
                            win_in_row:0, maxScore: playerOneScore})
                    } else if (!w & !max) {
                            snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1, avgScore: avg,
                            win_in_row:0})
                    } else {
                            snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_multi: nGames_multi + 1, avgScore: avg,
                            win_in_row:win_in_row + 1, maxScore: playerOneScore, win: win + 1})
                    }
                } else {
                    if (max) {
                        snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_sing: nGames_sing + 1, avgScore: avg, maxScore: playerOneScore})
                    } else {
                        snpaStats.ref.child('statistics').update({ nGames: nGames + 1, nGames_sing: nGames_sing + 1, avgScore: avg})
                    }
                }

                if (!f & !c){

                } else if (f & !c) {
                    snpaStats.ref.child('statistics').child('badge').update({ fire:true})
                } else if (!f & c) {
                    snpaStats.ref.child('statistics').child('badge').update({ center:true})
                } else {
                    snpaStats.ref.child('statistics').child('badge').update({ fire:true, center:true})

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

        })

    });



exports.addCoordinate = functions.region('europe-west1').database
    .ref('/Games/{gameID}')
    .onCreate((snaposhot, context) => {

        var continent1 = getRandomContinent();
        var point1 = randomPointsOnPolygon(1, continent1);

        var x5= point1[0]["geometry"]["coordinates"][0];
        var y5= point1[0]["geometry"]["coordinates"][1];
        
        var continent2 = getRandomContinent();
        var point2 = randomPointsOnPolygon(1, continent2);

        var x1 = point2[0]["geometry"]["coordinates"][0];
        var y1= point2[0]["geometry"]["coordinates"][1];
        
        var continent3 = getRandomContinent();
        var point3 = randomPointsOnPolygon(1, continent3);

        var x2 = point3[0]["geometry"]["coordinates"][0];
        var y2= point3[0]["geometry"]["coordinates"][1];

        var continent4 = getRandomContinent();
        var point4 = randomPointsOnPolygon(1, continent4);

        var x3 = point4[0]["geometry"]["coordinates"][0];
        var y3= point4[0]["geometry"]["coordinates"][1];

        var continent5 = getRandomContinent();
        var point5 = randomPointsOnPolygon(1, continent5);

        var x4 = point5[0]["geometry"]["coordinates"][0];
        var y4= point5[0]["geometry"]["coordinates"][1];

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

function getRandomContinent() {

    var randomContinent = Math.floor(Math.random()*6);
    
    //ASIA
    if(randomContinent == 0){
        
        var randomArea = Math.floor(Math.random()*5)
        
        switch (randomArea) {
            case 0:
                return turf.polygon([[[11.6952727,-260.4638672],
                    [19.1866777,-262.0019531],
                    [20.1384703,-259.8925781],
                    [17.5183442,-258.9257813],
                    [18.1876066,-256.5087891],
                    [13.410994,-257.4316406],
                    [14.1365757,-255.1904297],
                    [11.1352871,-254.3994141],
                    [10.9627643,-255.7617188],
                    [13.1115801,-258.5742188],
                    [13.7954062,-260.3759766],
                    [11.4800246,-260.4199219],
                    [11.6952727,-260.4638672]
                    ]]);
            case 1:
                return turf.polygon([[[41.2117215,-219.6166992],
                    [40.4803814,-220.0561523],
                    [39.5887573,-219.9243164],
                    [38.2554364,-220.3308105],
                    [37.2040816,-221.6711426],
                    [36.6419778,-223.3630371],
                    [35.6394411,-223.9782715],
                    [35.380093,-227.2412109],
                    [34.1618182,-229.0649414],
                    [33.897777,-228.7683105],
                    [34.0435565,-228.1091309],
                    [33.8704156,-227.8015137],
                    [33.9798087,-227.208252],
                    [33.468108,-227.6367188],
                    [32.99945,-227.5158691],
                    [32.7503226,-227.1643066],
                    [33.4772722,-226.6259766],
                    [33.5413947,-226.0437012],
                    [33.2019242,-225.7800293],
                    [34.3978449,-225.2416992],
                    [33.4955977,-224.2419434],
                    [34.0344526,-223.7585449],
                    [34.3525067,-223.2092285],
                    [34.642247,-222.7697754],
                    [35.0659731,-221.2207031],
                    [34.6783937,-221.1657715],
                    [34.9579953,-220.8361816],
                    [35.2815007,-220.7702637],
                    [34.9940038,-220.1000977],
                    [35.2186975,-219.6826172],
                    [35.5501053,-219.4628906],
                    [35.7375952,-219.1662598],
                    [36.350527,-219.440918],
                    [37.0814756,-219.0454102],
                    [38.2209198,-219.1223145],
                    [39.5972232,-217.902832],
                    [40.6306301,-218.5510254],
                    [41.3685641,-218.638916],
                    [41.483891,-218.9904785],
                    [41.3850519,-219.1223145],
                    [41.2034562,-219.1992188],
                    [40.8719878,-219.0454102],
                    [40.8470604,-219.342041],
                    [41.2117215,-219.6166992]
                    ]]);
            case 2:
                return turf.polygon([[[33.8156663,-229.284668],
                    [33.1007454,-230.3173828],
                    [31.8215645,-229.6801758],
                    [31.203405,-228.8232422],
                    [32.6578757,-228.1860352],
                    [33.5047591,-228.6474609],
                    [33.8156663,-229.284668]
                    ]]);
            case 3:
                return turf.polygon([[[37.5794125,-233.7890625],
                    [36.9850031,-233.5253906],
                    [34.7777158,-231.1523438],
                    [37.1603165,-230.9326172],
                    [38.6855098,-232.0751953],
                    [37.5794125,-233.7890625]
                    ]]);
            case 4:
                return turf.polygon([[[56.0474996,35.5957031],
                    [55.8506499,35.6835938],
                    [51.0966229,39.1552734],
                    [56.4382037,38.4521484],
                    [56.0474996,35.5957031]
                    ]]);
            default:
                return null;
        }

    }

    //AFRICA
    if(randomContinent == 1){
        var randomArea = Math.floor(Math.random()*4)
        
        switch (randomArea) {
            case 0:
                return turf.polygon([[[-28.459033,16.5673828],
                    [-28.5362745,19.9951172],
                    [-18.5212833,21.1376953],
                    [-22.2280904,29.3554688],
                    [-22.5531475,31.2451172],
                    [-25.8789944,32.1240234],
                    [-27.3717673,31.7724609],
                    [-32.7318409,28.6083984],
                    [-33.9798087,25.4882813],
                    [-33.9068956,22.3242188],
                    [-33.4314413,20.3027344],
                    [-32.2128011,18.5449219],
                    [-28.6520306,16.3037109],
                    [-28.459033,16.5673828]
                    ]]);
            case 1:
                return turf.polygon([[[-1.1425024,34.0576172],
                    [1.1864386,35.2001953],
                    [-2.2845507,40.6933594],
                    [-4.9158328,39.0673828],
                    [-2.8552628,37.1777344],
                    [-1.9332268,35.6835938],
                    [-1.3621763,34.1455078],
                    [-1.1425024,34.0576172]
                    ]]);
            case 2:
                return turf.polygon([[[14.4346802,-17.3144531],
                    [13.6246334,-16.5234375],
                    [13.6673383,-15.1171875],
                    [13.3254849,-13.7548828],
                    [14.0939572,-12.0849609],
                    [16.5519617,-16.2597656],
                    [14.6048472,-17.3583984],
                    [14.4346802,-17.3144531]
                    ]]);
            case 3:
                return turf.polygon([[[4.8720477,-2.6806641],
                    [10.7469693,-2.9882813],
                    [10.9627643,-0.1757813],
                    [5.9220446,1.2744141],
                    [4.8720477,-2.5927734],
                    [4.8720477,-2.6806641]
                    ]]);
            default:
                return null;
        }
    }

    //AMERICA DEL NORD
    if(randomContinent == 2){
       
        return turf.polygon([[[53.8006508,-124.3652344],
            [53.9043382,-119.0039063],
            [53.8006508,-113.1152344],
            [45.6447682,-73.4765625],
            [48.5166043,-68.2470703],
            [48.8936154,-65.6542969],
            [47.9899217,-66.1816406],
            [47.754098,-65.1269531],
            [46.5588603,-64.9072266],
            [45.6447682,-62.7978516],
            [45.9205873,-59.765625],
            [43.4848121,-65.6982422],
            [44.6217541,-65.8300781],
            [45.1510533,-64.7314453],
            [45.1820368,-63.2373047],
            [45.7368595,-64.8193359],
            [43.8978924,-69.7412109],
            [42.4234565,-71.0595703],
            [41.902277,-70.3125],
            [41.3108239,-72.9931641],
            [40.8802948,-73.5644531],
            [37.9961627,-75.5859375],
            [39.3002992,-76.3769531],
            [36.5272948,-76.0253906],
            [35.3173663,-76.4208984],
            [33.760882,-78.75],
            [32.2871326,-80.5517578],
            [30.8267809,-81.6503906],
            [26.7456104,-79.9804688],
            [25.1651734,-80.6396484],
            [26.6278182,-82.0458984],
            [28.8446737,-82.4414063],
            [29.9930023,-83.8476563],
            [30.4865508,-87.7587891],
            [30.1831218,-90.0439453],
            [29.2672329,-89.0332031],
            [29.7643774,-94.21875],
            [28.381735,-96.7675781],
            [27.4497903,-97.5585938],
            [25.8394494,-97.4267578],
            [22.187405,-97.8222656],
            [18.979026,-96.1083984],
            [18.0623123,-94.6142578],
            [18.5629474,-92.5048828],
            [18.2293513,-91.8896484],
            [19.4769502,-90.5712891],
            [20.9614396,-90.1318359],
            [21.4939636,-88.8574219],
            [21.4121622,-87.7148438],
            [21.4530686,-87.1875],
            [15.9190735,-88.9013672],
            [13.8807458,-90.2636719],
            [16.130262,-94.6582031],
            [15.5807107,-96.2402344],
            [17.2247582,-100.8105469],
            [19.7667036,-105.5126953],
            [21.902278,-105.1611328],
            [26.234302,-109.0722656],
            [31.203405,-113.0273438],
            [31.6533814,-114.6533203],
            [31.1658096,-114.9169922],
            [30.0310554,-114.4335938],
            [26.6670958,-111.5771484],
            [24.4871486,-110.4785156],
            [23.2413461,-109.5117188],
            [28.3043807,-114.2138672],
            [32.1384087,-116.9824219],
            [33.7974088,-117.9492188],
            [34.3797126,-120.4101563],
            [39.7071867,-123.9257813],
            [42.8115217,-124.5410156],
            [45.2748864,-124.1015625],
            [47.15984,-122.9589844],
            [48.7489453,-122.8710938],
            [49.9512199,-123.3984375],
            [53.6446378,-131.484375],
            [53.9043382,-119.0039063],
            [53.8006508,-124.3652344]
            ]]);
         
    }

    //AMERICA DEL SUD
    if(randomContinent == 3){
        var randomArea = Math.floor(Math.random()*4)
        
        switch (randomArea) {
            case 0:
                return turf.polygon([[[-41.5414777,-73.4765625],
                    [-48.7489453,-74.0917969],
                    [-54.1109429,-70.5761719],
                    [-54.7753459,-67.8076172],
                    [-50.5134265,-69.4335938],
                    [-47.4280873,-65.9179688],
                    [-46.8301336,-67.5439453],
                    [-45.8594121,-67.5439453],
                    [-43.7075935,-65.3027344],
                    [-40.8470604,-65.2587891],
                    [-40.8802948,-62.7539063],
                    [-38.7883454,-62.2265625],
                    [-38.2036553,-58.1396484],
                    [-34.4159734,-57.8320313],
                    [-34.0890613,-53.5693359],
                    [-32.8057447,-53.3056641],
                    [-25.562265,-54.0527344],
                    [-27.3717673,-56.2060547],
                    [-27.1373684,-58.4912109],
                    [-25.0855989,-58.1835938],
                    [-22.187405,-63.5009766],
                    [-22.9583933,-67.5878906],
                    [-17.5602465,-69.7412109],
                    [-27.5277582,-70.7958984],
                    [-33.4314413,-71.8066406],
                    [-37.5445773,-73.6083984],
                    [-39.436193,-72.9931641],
                    [-41.5414777,-73.4765625]
                    ]]);
            case 1:
                return turf.polygon([[[3.1185762,-76.4208984],
                    [4.4778565,-73.7182617],
                    [6.4244835,-75.234375],
                    [6.2716181,-76.0473633],
                    [3.4914894,-76.7944336],
                    [3.1185762,-76.4208984]
                    ]]);
            case 2:
                return turf.polygon([[[-2.1967272,-48.9990234],
                    [-5.484768,-42.9785156],
                    [-6.8391696,-35.7714844],
                    [-10.1419317,-36.9140625],
                    [-13.410994,-39.8583984],
                    [-15.7922536,-48.2080078],
                    [-20.6739053,-54.9755859],
                    [-24.6270447,-50.7788086],
                    [-30.7890368,-51.3720703],
                    [-28.3430649,-48.9550781],
                    [-25.1651734,-47.9882813],
                    [-23.4430889,-45.703125],
                    [-22.7559207,-42.2314453],
                    [-17.8532901,-39.6386719],
                    [-12.9403221,-38.6279297],
                    [-10.0986701,-36.0791016],
                    [-7.4931965,-34.7607422],
                    [-5.5285105,-35.7275391],
                    [-3.9957805,-38.5400391],
                    [-2.6796866,-43.8134766],
                    [-0.4394488,-47.4169922],
                    [-1.1864386,-48.8232422],
                    [-2.1967272,-48.9990234]
                    ]]);
            case 3:
                return turf.polygon([[[1.3182431,-79.2773438],
                    [-1.4061088,-77.6074219],
                    [-4.7406754,-78.046875],
                    [-9.2756222,-77.34375],
                    [-12.6403383,-75.5859375],
                    [-14.51978,-73.3886719],
                    [-18.729502,-69.0820313],
                    [-18.1458518,-70.6640625],
                    [-14.6898814,-75.6738281],
                    [-12.6403383,-76.7285156],
                    [-10.2284373,-78.3105469],
                    [-7.1881009,-79.2773438],
                    [-5.5285105,-81.1230469],
                    [-0.7031074,-80.5078125],
                    [0.4394488,-79.453125],
                    [1.3182431,-79.2773438]
                    ]]);
            default:
                return null;
        }
    }

    //EUROPA
    if(randomContinent == 4){
        var randomArea = Math.floor(Math.random()*5)
        
        switch (randomArea) {
            case 0:
                return turf.polygon([[[36.1201276,-5.7348633],
                    [36.7564903,-4.21875],
                    [36.7916906,-2.0874023],
                    [37.4399741,-1.5380859],
                    [37.561997,-0.7910156],
                    [38.2554364,-0.5273438],
                    [38.7198047,0.2197266],
                    [39.0106475,-0.2197266],
                    [39.3512904,-0.2856445],
                    [40.2292182,0.1318359],
                    [41.0130658,0.9448242],
                    [41.902277,3.1201172],
                    [42.7954007,3.0322266],
                    [43.3731122,3.4277344],
                    [43.4688676,4.152832],
                    [43.3731122,4.8779297],
                    [43.1330612,6.1303711],
                    [44.370987,8.7011719],
                    [44.0086201,10.0195313],
                    [42.9403392,10.5908203],
                    [41.3768086,12.8979492],
                    [41.2612915,13.6450195],
                    [40.6473036,14.7216797],
                    [40.0276144,15.534668],
                    [39.044786,16.171875],
                    [38.6511983,15.9521484],
                    [38.2554364,15.6225586],
                    [37.978845,12.5024414],
                    [37.6664292,12.590332],
                    [36.6507925,15.0073242],
                    [37.6316348,15.2709961],
                    [37.978845,15.5786133],
                    [37.9441975,15.8862305],
                    [38.822591,16.6992188],
                    [38.942321,17.1166992],
                    [39.7240886,16.5454102],
                    [40.4636663,17.0288086],
                    [40.2124407,17.8637695],
                    [39.8928799,18.3911133],
                    [40.697299,17.9296875],
                    [41.4591954,16.0839844],
                    [41.8204551,16.105957],
                    [41.9676592,15.1171875],
                    [42.3747784,14.3481445],
                    [43.5803909,13.6230469],
                    [44.2137099,12.3925781],
                    [45.1200528,12.3046875],
                    [45.4138765,12.4365234],
                    [45.8441078,13.4692383],
                    [45.1510533,13.6230469],
                    [44.7311256,13.996582],
                    [45.3058026,14.3041992],
                    [43.7710938,15.6005859],
                    [42.4720969,18.4130859],
                    [43.6917079,16.8969727],
                    [45.0580014,15.8642578],
                    [45.1820368,17.3144531],
                    [44.8714428,18.8964844],
                    [45.8287993,18.8525391],
                    [46.1646145,19.9291992],
                    [45.2284806,21.3574219],
                    [44.1664447,22.6318359],
                    [43.149094,22.9833984],
                    [42.3585439,22.5],
                    [42.1796882,21.2475586],
                    [41.9349765,20.6103516],
                    [42.2935642,20.3686523],
                    [41.8204551,19.3798828],
                    [40.3800284,19.3579102],
                    [39.6056882,20.0830078],
                    [38.4019491,21.1157227],
                    [37.3526928,21.730957],
                    [36.8971945,21.7529297],
                    [36.4212824,22.565918],
                    [36.5272948,23.1591797],
                    [37.5271536,22.8955078],
                    [37.9961627,23.4448242],
                    [37.4748581,24.3017578],
                    [39.9097362,22.6318359],
                    [40.413496,22.6757813],
                    [40.0444376,23.3569336],
                    [40.1788733,24.1479492],
                    [40.5972706,23.6645508],
                    [40.963308,24.8730469],
                    [40.7971774,26.0375977],
                    [42.5692644,27.5537109],
                    [44.5278428,28.9379883],
                    [45.0735206,29.7509766],
                    [45.4909457,28.2128906],
                    [46.6795945,28.125],
                    [48.3416462,26.9824219],
                    [47.9016135,29.2236328],
                    [46.5286347,29.9267578],
                    [47.3685943,35.2001953],
                    [50.2331518,35.7714844],
                    [52.2950423,33.75],
                    [51.2619149,30.5859375],
                    [51.5634123,24.0380859],
                    [52.2681574,23.203125],
                    [52.7761857,23.90625],
                    [53.8525266,23.5546875],
                    [54.1366965,25.1367188],
                    [54.826008,25.7519531],
                    [55.2540771,26.4990234],
                    [55.7023551,26.5429688],
                    [56.1455495,28.1689453],
                    [57.5158229,27.2460938],
                    [58.7225988,27.421875],
                    [59.377988,28.1030273],
                    [59.4562434,27.0043945],
                    [59.6010955,25.7739258],
                    [59.2434148,23.7744141],
                    [58.983991,23.5107422],
                    [58.7111891,23.4887695],
                    [58.2517272,23.90625],
                    [58.3441006,24.4335938],
                    [57.6689107,24.4116211],
                    [57.2196085,24.3676758],
                    [56.9569571,23.5546875],
                    [57.7041472,22.5878906],
                    [57.551208,21.8408203],
                    [57.3146574,21.4013672],
                    [56.9209968,21.3793945],
                    [56.5594825,20.9619141],
                    [54.8892464,21.1376953],
                    [54.9523857,19.9731445],
                    [54.7119288,19.9951172],
                    [54.673831,20.4785156],
                    [54.213861,19.2700195],
                    [54.6865342,18.3032227],
                    [54.8006849,18.2373047],
                    [54.5083265,16.6552734],
                    [53.8395637,14.3261719],
                    [52.8558642,14.1723633],
                    [52.6030475,14.4580078],
                    [52.3353391,14.5898438],
                    [50.9722649,14.8974609],
                    [51.0068423,14.2492676],
                    [50.9030328,14.3371582],
                    [50.7155911,13.5791016],
                    [50.2331518,12.3486328],
                    [50.2752986,12.1618652],
                    [49.9158617,12.590332],
                    [49.7244792,12.4255371],
                    [48.7634311,13.8208008],
                    [48.6038576,14.2602539],
                    [48.6619428,14.6557617],
                    [48.980217,15.1391602],
                    [48.6909604,16.6992188],
                    [48.004625,17.1606445],
                    [47.7097615,17.1606445],
                    [47.7245445,16.7431641],
                    [47.6357836,16.5234375],
                    [47.3834739,16.5673828],
                    [46.8752134,16.3256836],
                    [46.452997,14.5239258],
                    [46.7248004,12.4584961],
                    [47.0850854,12.019043],
                    [46.8150986,11.0083008],
                    [46.9652594,10.3710938],
                    [47.0102257,9.5800781],
                    [47.487513,9.6459961],
                    [47.6949743,8.8549805],
                    [47.5617008,7.7563477],
                    [47.9310663,7.4926758],
                    [48.3708477,7.734375],
                    [48.936935,8.3056641],
                    [49.1673386,6.7016602],
                    [49.4252672,6.5039063],
                    [50.1064877,6.1303711],
                    [50.4295179,6.4819336],
                    [50.7225468,6.2182617],
                    [51.0413939,5.9765625],
                    [51.7814356,6.1083984],
                    [51.9442649,6.7675781],
                    [52.2277994,7.03125],
                    [52.5897008,6.7895508],
                    [53.2520688,7.2509766],
                    [53.47497,6.8115234],
                    [53.0940241,4.8339844],
                    [52.3487632,4.5483398],
                    [51.0413939,2.6586914],
                    [50.9168875,1.7138672],
                    [50.1205781,1.5161133],
                    [49.6391772,0.2416992],
                    [49.2964716,-0.1977539],
                    [49.3537557,-1.0986328],
                    [49.6391772,-1.340332],
                    [49.7102726,-1.8237305],
                    [48.6329086,-1.4501953],
                    [48.7634311,-3.1420898],
                    [48.5602498,-4.7900391],
                    [48.2246726,-4.4604492],
                    [48.004625,-4.6801758],
                    [47.8574029,-4.2626953],
                    [47.44295,-2.4389648],
                    [46.5588603,-1.7578125],
                    [45.9205873,-0.9008789],
                    [43.436966,-1.4941406],
                    [43.2932003,-2.1313477],
                    [43.3731122,-4.3725586],
                    [43.6440258,-7.9321289],
                    [43.1330612,-9.0527344],
                    [40.7139558,-8.5253906],
                    [38.925229,-9.4042969],
                    [38.4105583,-8.9208984],
                    [37.1252863,-8.7890625],
                    [37.1603165,-6.9433594],
                    [36.0668621,-5.8007813],
                    [36.1201276,-5.7348633]
                    ]]);
            case 1:
                return turf.polygon([[[50.007739,-5.4492188],
                    [50.3174081,-3.8671875],
                    [50.6807971,-3.1201172],
                    [50.4295179,-2.0214844],
                    [50.7920471,-1.0986328],
                    [50.7364551,0.6591797],
                    [51.179343,1.5820313],
                    [51.4266145,0.7470703],
                    [52.2950423,1.6259766],
                    [52.7495937,1.2744141],
                    [52.8823912,0.8789063],
                    [52.8027614,0.3515625],
                    [53.9043382,-0.0439453],
                    [54.3421489,-0.4833984],
                    [54.6484125,-1.1425781],
                    [55.6775844,-1.7138672],
                    [55.9491998,-2.7246094],
                    [55.9737982,-3.7353516],
                    [56.3409012,-2.6367188],
                    [57.4922137,-2.0214844],
                    [57.5394168,-4.0429688],
                    [58.6083337,-3.1201172],
                    [58.5166518,-4.6142578],
                    [57.9615031,-5.2734375],
                    [57.016814,-6.0644531],
                    [56.4382037,-6.1083984],
                    [56.6078855,-5.3173828],
                    [55.7023551,-6.4599609],
                    [55.8259733,-5.7568359],
                    [55.3541353,-5.7128906],
                    [56.0474996,-4.8339844],
                    [55.0280221,-4.921875],
                    [54.213861,-4.4824219],
                    [54.3421489,-3.6914063],
                    [54.1109429,-3.0761719],
                    [53.5141845,-3.0322266],
                    [53.2257684,-4.3945313],
                    [52.8823912,-4.6142578],
                    [52.6963611,-4.1748047],
                    [52.4292223,-4.1308594],
                    [51.8629239,-5.0097656],
                    [51.6180165,-3.9990234],
                    [51.4266145,-3.3837891],
                    [51.5907226,-2.5048828],
                    [51.0137547,-4.0869141],
                    [50.0923932,-5.4931641],
                    [50.007739,-5.4492188]
                    ]]);
            case 2:
                return turf.polygon([[[51.4540069,-9.3603516],
                    [52.1065052,-7.2949219],
                    [52.2681574,-6.4160156],
                    [53.9560855,-6.1962891],
                    [54.3165232,-5.625],
                    [55.1286491,-6.1523438],
                    [55.1286491,-7.4267578],
                    [55.1035161,-7.9541016],
                    [54.8766067,-8.3056641],
                    [54.5720617,-8.9648438],
                    [54.5975279,-7.8222656],
                    [54.3165232,-8.7011719],
                    [54.213861,-9.84375],
                    [53.4095319,-10.0195313],
                    [53.2257684,-9.2724609],
                    [53.7227167,-9.1845703],
                    [52.6697204,-9.5800781],
                    [52.1874047,-10.1953125],
                    [51.7542401,-9.9316406],
                    [51.3992057,-9.4042969],
                    [51.4540069,-9.3603516]
                    ]]);
            case 3:
                return turf.polygon([[[59.489726,10.8105469],
                    [57.3739384,12.0410156],
                    [55.4290135,13.6230469],
                    [56.0720355,14.5898438],
                    [56.1210604,16.0839844],
                    [58.4936938,17.1386719],
                    [59.534318,18.8085938],
                    [60.7161978,17.6660156],
                    [61.5226949,17.0507813],
                    [62.5933408,18.0175781],
                    [63.782486,20.5664063],
                    [65.8747247,22.6757813],
                    [65.5129626,24.7851563],
                    [64.8489373,25.0488281],
                    [63.0350393,21.796875],
                    [60.8449106,21.2695313],
                    [59.9770055,23.1152344],
                    [60.5005254,27.5097656],
                    [62.4717237,31.5527344],
                    [63.6657603,30.1464844],
                    [68.8159271,28.7402344],
                    [70.8734913,28.5644531],
                    [70.9310035,25.2246094],
                    [70.2297445,22.7636719],
                    [70.0205873,19.3359375],
                    [68.8793576,16.9628906],
                    [64.9979392,11.6894531],
                    [61.6898722,5.3613281],
                    [58.5395948,5.8886719],
                    [57.7979439,8.0859375],
                    [58.8592235,8.9648438],
                    [59.0857386,10.2832031],
                    [59.489726,10.8105469]
                    ]]);
            case 4:
                return turf.polygon([[[63.8018935,-22.6318359],
                    [63.8212877,-21.1376953],
                    [63.3915217,-18.8964844],
                    [64.1681069,-15.46875],
                    [64.8115573,-13.8867188],
                    [65.6220226,-14.6777344],
                    [66.0893643,-14.9414063],
                    [66.337505,-16.2597656],
                    [65.9106233,-20.1269531],
                    [65.1830301,-21.2695313],
                    [66.1960089,-22.2363281],
                    [65.6220226,-24.0820313],
                    [65.4400017,-22.1484375],
                    [65.0350604,-22.5],
                    [64.0144962,-22.4121094],
                    [63.8018935,-22.6318359]
                    ]]);
            default:
                return null;
        }
    }

    //OCEANIA
    if(randomContinent == 5){
            var randomArea = Math.floor(Math.random()*10)
            
            switch (randomArea) {
                case 0:
                    return turf.polygon([[[-34.4703351,-187.2290039],
                        [-37.1953306,-185.4492188],
                        [-37.8401568,-185.2734375],
                        [-38.4965935,-185.3613281],
                        [-39.3002992,-186.1083984],
                        [-40.1788733,-184.855957],
                        [-40.7306085,-184.921875],
                        [-41.2778065,-185.2514648],
                        [-41.5743613,-184.6582031],
                        [-40.4636663,-183.3837891],
                        [-39.2322531,-182.8344727],
                        [-39.1130137,-182.4609375],
                        [-39.2322531,-182.0654297],
                        [-38.7883454,-181.9775391],
                        [-37.8054439,-181.4941406],
                        [-37.6838203,-182.0214844],
                        [-37.9441975,-182.9223633],
                        [-37.4225259,-184.0869141],
                        [-36.5802466,-184.6362305],
                        [-36.7916906,-184.855957],
                        [-35.3173663,-185.7568359],
                        [-34.4703351,-187.097168],
                        [-34.4703351,-187.2290039]
                        ]]);
                case 1:
                    return turf.polygon([[[-46.5739668,-191.2939453],
                        [-43.2452027,-187.4047852],
                        [-43.7710938,-186.8774414],
                        [-43.9770047,-187.9980469],
                        [-44.245199,-188.4375],
                        [-44.5748174,-188.7670898],
                        [-44.9958826,-188.7670898],
                        [-46.6041672,-190.5688477],
                        [-46.5739668,-191.2939453]
                        ]]);
                case 2:
                    return turf.polygon([[[-34.8859309,-221.0449219],
                        [-37.9961627,-219.4628906],
                        [-38.4793947,-214.5410156],
                        [-37.3002753,-210.3222656],
                        [-34.3797126,-208.6523438],
                        [-27.6056708,-207.0703125],
                        [-33.0639242,-211.640625],
                        [-34.9579953,-213.6621094],
                        [-35.8178132,-217.7050781],
                        [-34.8859309,-221.0449219]
                        ]]);
                case 3:
                    return turf.polygon([[[-34.2345124,-244.6875],
                        [-35.0299964,-242.3144531],
                        [-34.2345124,-240.1171875],
                        [-30.069094,-244.7753906],
                        [-32.9164853,-244.2480469],
                        [-34.2345124,-244.6875]
                        ]]);
                case 4:
                    return turf.polygon([[[-41.0462168,-215.3320313],
                        [-42.6177914,-212.2558594],
                        [-41.0462168,-212.1679688],
                        [-41.3768086,-213.5742188],
                        [-41.0462168,-215.3320313]
                        ]]);
                case 5:
                    return turf.polygon([[[3.206333,-258.3544922],
                        [0.0439453,-260.5957031],
                        [-1.4500405,-259.2333984],
                        [-3.2502086,-258.046875],
                        [-5.703448,-255.4101563],
                        [-5.6597186,-254.4873047],
                        [-2.8991527,-254.1796875],
                        [-0.7031074,-256.4208984],
                        [2.0210651,-258.1347656],
                        [3.206333,-258.3544922]
                        ]]);
                case 6:
                    return turf.polygon([[[-7.0136679,-254.0039063],
                        [-8.3636927,-247.5878906],
                        [-8.7982255,-243.984375],
                        [-8.9718973,-242.4902344],
                        [-8.5375654,-240.9960938],
                        [-8.1897423,-244.5117188],
                        [-7.6674415,-246.0498047],
                        [-7.5367643,-246.8408203],
                        [-7.1008927,-247.3242188],
                        [-6.8391696,-249.0820313],
                        [-6.8828002,-250.6201172],
                        [-6.0531613,-253.5644531],
                        [-6.4026484,-254.0478516],
                        [-7.0136679,-254.0039063]
                        ]]);
                case 7:
                    return turf.polygon([[[14.5091444,-239.5019531],
                        [14.7748825,-239.3481445],
                        [14.6048472,-239.0625],
                        [13.8914111,-239.2602539],
                        [13.7100353,-238.8647461],
                        [13.9127401,-238.5131836],
                        [14.2643831,-238.4033203],
                        [15.2523895,-238.5681152],
                        [15.9613291,-238.5351563],
                        [16.5098328,-237.6123047],
                        [18.0205277,-237.9199219],
                        [18.4379247,-239.2382813],
                        [16.8045411,-239.5898438],
                        [16.130262,-239.666748],
                        [16.3412256,-240.1171875],
                        [15.4748574,-240.0402832],
                        [14.5091444,-239.5019531]
                        ]]);
                case 8:
                    return turf.polygon([[[14.1365757,-237.7441406],
                        [13.4003071,-236.8103027],
                        [12.5867324,-235.9973145],
                        [13.0259659,-235.8984375],
                        [13.1650739,-236.2060547],
                        [13.5178377,-236.4367676],
                        [13.7207084,-236.4038086],
                        [13.7740664,-236.151123],
                        [14.0193557,-236.7114258],
                        [13.7954062,-236.8212891],
                        [14.2963237,-237.4365234],
                        [14.1365757,-237.7441406]
                        ]]);
                case 9:
                    return turf.polygon([[[13.410994,-239.6118164],
                        [12.833226,-239.095459],
                        [12.4902137,-238.996582],
                        [12.1682257,-238.7988281],
                        [12.5974545,-238.5461426],
                        [13.0366693,-238.5900879],
                        [13.3147941,-238.8427734],
                        [13.3789317,-239.1064453],
                        [13.410994,-239.6118164]
                        ]]);
                default:
                    return null;
            }
        }

    

    








}    
