const mysql = require( 'mysql' );
const http = require('http')

config = {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "ka3",
    multipleStatements: true
}

const apiHost = process.env.API_HOST || "127.0.0.1"
const apiPort = process.env.API_PORT || 3001
const apiMethod = "POST"

function checkQueue(connection) {
    return new Promise((resolve1, reject1) => {
        const query1 = 'SELECT id, person_id, type_id, infinite, started_at, completed_at, cancelled_at FROM action WHERE started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 8 HOUR < now();'
        connection.query(query1, function(err1, rows1) {
            if (err1) {
                return reject1(err1)
            } else {
                console.log('Number of actions: ' + rows1.length)
                return Promise.all(
                    rows1.map(row1 => {
                        if (row1['type_id'] == 1) {
                            actionGetFood(connection, row1)
                        } else if (row1['type_id'] == 2) {
                            actionGetWood(connection, row1)
                        } else if (row1['type_id'] == 3) {
                            actionIncreaseStorage(connection, row1)
                        } else if (row1['type_id'] == 4) {
                            actionIncreaseRooms(connection, row1)
                        } else if (row1['type_id'] == 5) {
                            actionCreateHouse(connection, row1)
                        } else if (row1['type_id'] == 6) {
                            actionDoNothing(connection, row1)
                        }
                    })
                ).then(() => {
                    resolve1()
                })
            }
        })
    }).then(() => {
        actionMoveHouse(connection)
    }).then(() => {
        return new Promise((resolveEnd, rejectEnd) => {
            connection.end( errEnd => {
                if ( errEnd ) {
                    return rejectEnd(errEnd)
                } else {
                    resolveEnd()
                }
            })
        })
    })
}

if (process.env.ENV === 'local') {
    connection = mysql.createConnection(config)
    checkQueue(connection)
} else {
    exports.handler = function (event, context) {
        connection = mysql.createConnection(config)
        checkQueue(connection)
    }
}

function actionGetFood(conn, data) {
    return new Promise((resolve2, reject2) => {
        const query2 = `
            SELECT
                house.storage,
                COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
                COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = house.id), 0) AS wood,
                COALESCE((
                    SELECT SUM(offered_volume)
                    FROM trade
                    WHERE
                        house_id = (SELECT house_id FROM person WHERE id = ` + data['person_id'] + `) AND
                        offered_type IN (1, 2) AND
                        completed_at IS NULL AND
                        cancelled_at IS NULL
                ), 0) AS in_trade
            FROM person
                INNER JOIN house ON person.house_id = house.id
            WHERE person.id = ` + data['person_id']
        conn.query(query2, function(err2, rows2) {
            if (err2) {
                return reject2(err2)
            } else {
                return Promise.all(
                    rows2.map(row2 => {
                        console.log('Action with ID ' + data['id'] + ' has house stats: ' + JSON.stringify(row2))
                        if (row2.storage >= row2.food + row2.wood + row2.in_trade + 2) {
                            return new Promise((resolve3, reject3) => {
                                const query3 = `
                                    UPDATE action SET completed_at = NOW() WHERE id = ` + data['id'] + `;
                                    UPDATE resource SET volume = volume + 2 WHERE type_name = 'food' AND house_id = (SELECT house_id FROM person WHERE id = ` + data['person_id'] + `);`
                                conn.query(query3, function(err3, res3) {
                                    if (err3) {
                                        return reject3(err3)
                                    } else {
                                        if (data['infinite'] == 1) {
                                            const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/increase-food/' + data['person_id'] + '?infinite=1' }
                                            http.request(options, function(res) {
                                                res.on('data', function (body) {
                                                    console.log('Kicked off infinite action with id ' + data['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                                                })
                                            }).end()
                                        }
                                        for (const msg of res3) {
                                            console.log('Action with ID ' + data['id'] + ' message: ' + msg.message)
                                        }
                                        resolve3(res3)
                                    }
                                })
                            })
                        } else {
                            return new Promise((resolve3, reject3) => {
                                const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + data['id']
                                conn.query(query3, function(err3, res3) {
                                    if (err3) {
                                        return reject3(err3)
                                    } else {
                                        console.log('Action with ID ' + data['id'] + ' message: ' + res3.message)
                                        resolve3(res3)
                                    }
                                })
                            })
                        }
                    })
                ).then(() => {
                    resolve2(rows2)
                })
            }
        })
    })
}

function actionGetWood(conn, data) {
    return new Promise((resolve2, reject2) => {
        const query2 = `
            SELECT
                house.storage,
                COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
                COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = house.id), 0) AS wood,
                COALESCE((
                    SELECT SUM(offered_volume)
                    FROM trade
                    WHERE
                        house_id = (SELECT house_id FROM person WHERE id = ` + data['person_id'] + `) AND
                        offered_type IN (1, 2) AND
                        completed_at IS NULL AND
                        cancelled_at IS NULL
                ), 0) AS in_trade
            FROM person
                INNER JOIN house ON person.house_id = house.id
            WHERE person.id = ` + data['person_id']
        conn.query(query2, function(err2, rows2) {
            if (err2) {
                return reject2(err2)
            } else {
                return Promise.all(
                    rows2.map(row2 => {
                        console.log('Action with ID ' + data['id'] + ' has house stats: ' + JSON.stringify(row2))
                        if (row2.storage >= row2.food + row2.wood + row2.in_trade + 1) {
                            return new Promise((resolve3, reject3) => {
                                const query3 = `
                                    UPDATE action SET completed_at = NOW() WHERE id = ` + data['id'] + `;
                                    UPDATE resource SET volume = volume + 1 WHERE type_name = 'wood' AND house_id = (SELECT house_id FROM person WHERE id = ` + data['person_id'] + `);`
                                conn.query(query3, function(err3, res3) {
                                    if (err3) {
                                        return reject3(err3)
                                    } else {
                                        if (data['infinite'] == 1) {
                                            const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/increase-wood/' + data['person_id'] + '?infinite=1' }
                                            http.request(options, function(res) {
                                                res.on('data', function (body) {
                                                    console.log('Kicked off infinite action with id ' + data['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                                                })
                                            }).end()
                                        }
                                        for (const msg of res3) {
                                            console.log('Action with ID ' + data['id'] + ' message: ' + msg.message)
                                        }
                                        resolve3(res3)
                                    }
                                })
                            })
                        } else {
                            return new Promise((resolve3, reject3) => {
                                const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + data['id']
                                conn.query(query3, function(err3, res3) {
                                    if (err3) {
                                        return reject3(err3)
                                    } else {
                                        console.log('Action with ID ' + data['id'] + ' message: ' + res3.message)
                                        resolve3(res3)
                                    }
                                })
                            })
                        }
                    })
                ).then(() => {
                    resolve2(rows2)
                })
            }
        })
    })
}

function actionIncreaseStorage(conn, data) {
    console.log('Executing action with ID ' + data['id'])
    return new Promise((resolve3, reject3) => {
        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + data['id'] + '; UPDATE house SET storage = storage + 3 WHERE id = (SELECT house_id FROM person WHERE id = ' + data['person_id'] + ');'
        conn.query(query3, function(err3, res3) {
            if (err3) {
                return reject3(err3)
            } else {
                if (data['infinite'] == 1) {
                    const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/modify-house/increase-storage/' + data['person_id'] + '?infinite=1' }
                    http.request(options, function(res) {
                        res.on('data', function (body) {
                            console.log('Kicked off infinite action with id ' + data['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                        })
                    }).end()
                }
                for (const msg of res3) {
                    console.log('Action with ID ' + data['id'] + ' message: ' + msg.message)
                }
                resolve3(res3)
            }
        })
    })
}

function actionIncreaseRooms(conn, data) {
    return new Promise((resolve3, reject3) => {
        console.log('Executing action with ID ' + data['id'])
        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + data['id'] + '; UPDATE house SET rooms = rooms + 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + data['person_id'] + ');'
        conn.query(query3, function(err3, res3) {
            if (err3) {
                return reject3(err3)
            } else {
                if (data['infinite'] == 1) {
                    const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/modify-house/increase-rooms/' + data['person_id'] + '?infinite=1' }
                    http.request(options, function(res) {
                        res.on('data', function (body) {
                            console.log('Kicked off infinite action with id ' + data['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                        })
                    }).end()
                }
                for (const msg of res3) {
                    console.log('Action with ID ' + data['id'] + ' message: ' + msg.message)
                }
                resolve3(res3)
            }
        })
    })
}

function actionCreateHouse(conn, data) {
    return new Promise((resolve3, reject3) => {
        console.log('Executing action with ID: ' + data['id'])
        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + data['id'] + '; INSERT INTO house (name, type_id, rooms, storage, land, family_id) VALUES (\'House\', 0, 1, 6, 0, (SELECT family_id FROM person WHERE id = ' + data['person_id'] + '));'
        conn.query(query3, function(err3, res3) {
            if (err3) {
                return reject3(err3)
            } else {
                if (data['infinite'] == 1) {
                    const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/create-house/' + data['person_id'] + '?infinite=1' }
                    http.request(options, function(res) {
                        res.on('data', function (body) {
                            console.log('Kicked off infinite action with id ' + data['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                        })
                    }).end()
                }
                for (const msg of res3) {
                    console.log('Action with ID ' + data['id'] + ' message: ' + msg.message)
                }
                resolve3(res3)
            }
        })
    })
}

function actionDoNothing(conn, data) {
    return new Promise((resolve2, reject2) => {
        const query2 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + data['id']
        conn.query(query2, function(err2, res2) {
            if (err2) {
                return reject2(err2)
            } else {
                console.log('Action with ID ' + data['id'] + ' message: ' + res2.message)
                resolve2(res2)
            }
        })
    })
}

function actionMoveHouse(conn) {
    return new Promise((resolve1, reject1) => {
        const query1 = `
            SELECT
                mh.id, mh.person_id, mh.origin_house_id, mh.destination_house_id, mh.started_at, mh.completed_at, mh.cancelled_at,
                destination_house.rooms AS destination_rooms, origin_house.rooms AS orgin_rooms,
                (SELECT COUNT(id) FROM person WHERE house_id = destination_house.id) AS destination_people,
                (SELECT COUNT(id) FROM person WHERE house_id = origin_house.id) AS origin_people
            FROM move_house mh
                INNER JOIN house destination_house ON mh.destination_house_id = destination_house.id
                INNER JOIN house origin_house ON mh.origin_house_id = origin_house.id
            WHERE completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 8 HOUR < NOW();`
        conn.query(query1, function(err1, rows1) {
            if (err1) {
                return reject1(err1)
            } else {
                console.log('Number of moves: ' + rows1.length)
                return Promise.all(
                    rows1.map(row1 => {
                        console.log('Executing move with ID ' + row1['id'])
                        return new Promise((resolve3, reject3) => {
                            console.log(row1)
                            if (row1['destination_rooms'] > row1['destination_people']) {
                                const query3 = `
                                    UPDATE move_house SET completed_at = NOW() WHERE id = ` + row1['id'] + `;
                                    UPDATE person SET house_id = ` + row1['destination_house_id'] + ` WHERE id = ` + row1['person_id']
                                console.log(query3)
                                conn.query(query3, function(err3, res3) {
                                    if (err3) {
                                        return reject3(err3)
                                    } else {
                                        for (const msg of res3) {
                                            console.log('Move with ID ' + row1['id'] + ' message: ' + msg.message)
                                        }
                                        resolve3(res3)
                                    }
                                })
                            } else if (row1['origin_rooms'] > row1['origin_people']) {
                                const query3 = `
                                    UPDATE move_house SET completed_at = NOW() WHERE id = ` + row1['id'] + `;
                                    UPDATE person SET house_id = ` + row1['origin_house_id'] + ` WHERE id = ` + row1['person_id']
                                conn.query(query3, function(err3, res3) {
                                    if (err3) {
                                        return reject3(err3)
                                    } else {
                                        for (const msg of res3) {
                                            console.log('Move with ID ' + row1['id'] + ' message: ' + msg.message)
                                        }
                                        resolve3(res3)
                                    }
                                })
                            } else {
                                const query3 = `
                                    UPDATE move_house SET cancelled_at = NOW() WHERE id = ` + row1['id']
                                conn.query(query3, function(err3, res3) {
                                    if (err3) {
                                        return reject3(err3)
                                    } else {
                                        for (const msg of res3) {
                                            console.log('Move with ID ' + row1['id'] + ' message: ' + msg.message)
                                        }
                                        resolve3(res3)
                                    }
                                })
                            }
                        })
                    })
                ).then(() => {
                    resolve1()
                })
            }
        })
    })
}
