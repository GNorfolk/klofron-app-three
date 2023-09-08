const mysql = require( 'mysql' );
const http = require('http')

config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "klofron-app-three",
    multipleStatements: true
}

const apiHost = process.env.API_HOST | "localhost"
const apiPort = process.env.API_PORT | 3001
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
                            return new Promise((resolve2, reject2) => {
                                const query2 = 'SELECT house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row1['person_id']
                                connection.query(query2, function(err2, rows2) {
                                    if (err2) {
                                        return reject2(err2)
                                    } else {
                                        return Promise.all(
                                            rows2.map(row2 => {
                                                console.log('Action with ID ' + row1['id'] + ' has house stats: ' + JSON.stringify(row2))
                                                if (row2.storage >= row2.food + row2.wood + 2) {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id'] + '; UPDATE house SET food = food + 2 WHERE id = (SELECT house_id FROM person WHERE id = ' + row1['person_id'] + ');'
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                if (row1['infinite'] == 1) {
                                                                    const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/increase-food/' + row1['person_id'] + '?infinite=1' }
                                                                    http.request(options, function(res) {
                                                                        res.on('data', function (body) {
                                                                            console.log('Kicked off infinite action with id ' + row1['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                                                                        })
                                                                    }).end()
                                                                }
                                                                for (const msg of res3) {
                                                                    console.log('Action with ID ' + row1['id'] + ' message: ' + msg.message)
                                                                }
                                                                resolve3(res3)
                                                            }
                                                        })
                                                    })
                                                } else {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                console.log('Action with ID ' + row1['id'] + ' message: ' + res3.message)
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
                        } else if (row1['type_id'] == 2) {
                            return new Promise((resolve2, reject2) => {
                                const query2 = 'SELECT house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row1['person_id']
                                connection.query(query2, function(err2, rows2) {
                                    if (err2) {
                                        return reject2(err2)
                                    } else {
                                        return Promise.all(
                                            rows2.map(row2 => {
                                                console.log('Action with ID ' + row1['id'] + ' has house stats: ' + JSON.stringify(row2))
                                                if (row2.storage >= row2.food + row2.wood + 1) {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id'] + '; UPDATE house SET wood = wood + 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + row1['person_id'] + ');'
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                if (row1['infinite'] == 1) {
                                                                    const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/increase-wood/' + row1['person_id'] + '?infinite=1' }
                                                                    http.request(options, function(res) {
                                                                        res.on('data', function (body) {
                                                                            console.log('Kicked off infinite action with id ' + row1['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                                                                        })
                                                                    }).end()
                                                                }
                                                                for (const msg of res3) {
                                                                    console.log('Action with ID ' + row1['id'] + ' message: ' + msg.message)
                                                                }
                                                                resolve3(res3)
                                                            }
                                                        })
                                                    })
                                                } else {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                console.log('Action with ID ' + row1['id'] + ' message: ' + res3.message)
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
                        } else if (row1['type_id'] == 3) {
                            return new Promise((resolve2, reject2) => {
                                const query2 = 'SELECT house.storage FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row1['person_id']
                                connection.query(query2, function(err2, rows2) {
                                    if (err2) {
                                        return reject2(err2)
                                    } else {
                                        return Promise.all(
                                            rows2.map(row2 => {
                                                console.log('Action with ID ' + row1['id'] + ' has house stats: ' + JSON.stringify(row2))
                                                if (row2.storage >= row2.food + row2.wood + 1) {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id'] + '; UPDATE house SET storage = storage + 3 WHERE id = (SELECT house_id FROM person WHERE id = ' + row1['person_id'] + ');'
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                if (row1['infinite'] == 1) {
                                                                    const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/modify-house/increase-storage/' + row1['person_id'] + '?infinite=1' }
                                                                    http.request(options, function(res) {
                                                                        res.on('data', function (body) {
                                                                            console.log('Kicked off infinite action with id ' + row1['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                                                                        })
                                                                    }).end()
                                                                }
                                                                for (const msg of res3) {
                                                                    console.log('Action with ID ' + row1['id'] + ' message: ' + msg.message)
                                                                }
                                                                resolve3(res3)
                                                            }
                                                        })
                                                    })
                                                } else {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                console.log('Action with ID ' + row1['id'] + ' message: ' + res3.message)
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
                        } else if (row1['type_id'] == 4) {
                            return new Promise((resolve2, reject2) => {
                                const query2 = 'SELECT house.storage FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row1['person_id']
                                connection.query(query2, function(err2, rows2) {
                                    if (err2) {
                                        return reject2(err2)
                                    } else {
                                        return Promise.all(
                                            rows2.map(row2 => {
                                                console.log('Action with ID ' + row1['id'] + ' has house stats: ' + JSON.stringify(row2))
                                                if (row2.storage >= row2.food + row2.wood + 1) {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id'] + '; UPDATE house SET rooms = rooms + 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + row1['person_id'] + ');'
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                if (row1['infinite'] == 1) {
                                                                    const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/modify-house/increase-rooms/' + row1['person_id'] + '?infinite=1' }
                                                                    http.request(options, function(res) {
                                                                        res.on('data', function (body) {
                                                                            console.log('Kicked off infinite action with id ' + row1['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                                                                        })
                                                                    }).end()
                                                                }
                                                                for (const msg of res3) {
                                                                    console.log('Action with ID ' + row1['id'] + ' message: ' + msg.message)
                                                                }
                                                                resolve3(res3)
                                                            }
                                                        })
                                                    })
                                                } else {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                console.log('Action with ID ' + row1['id'] + ' message: ' + res3.message)
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
                        } else if (row1['type_id'] == 5) {
                            return new Promise((resolve2, reject2) => {
                                const query2 = 'SELECT house.storage FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row1['person_id']
                                connection.query(query2, function(err2, rows2) {
                                    if (err2) {
                                        return reject2(err2)
                                    } else {
                                        return Promise.all(
                                            rows2.map(row2 => {
                                                console.log('Action with ID ' + row1['id'] + ' has house stats: ' + JSON.stringify(row2))
                                                if (row2.storage >= row2.food + row2.wood + 1) {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id'] + '; INSERT INTO house (name, rooms, storage, family_id) VALUES (\'House\', 1, 6, (SELECT family_id FROM person WHERE id = ' + row1['person_id'] + ');'
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                if (row1['infinite'] == 1) {
                                                                    const options = { host: apiHost, port: apiPort, method: apiMethod, path: '/v1/create-house/' + row1['person_id'] + '?infinite=1' }
                                                                    http.request(options, function(res) {
                                                                        res.on('data', function (body) {
                                                                            console.log('Kicked off infinite action with id ' + row1['id'] + ' with status ' + res.statusCode + ' and body: ' + body);
                                                                        })
                                                                    }).end()
                                                                }
                                                                for (const msg of res3) {
                                                                    console.log('Action with ID ' + row1['id'] + ' message: ' + msg.message)
                                                                }
                                                                resolve3(res3)
                                                            }
                                                        })
                                                    })
                                                } else {
                                                    return new Promise((resolve3, reject3) => {
                                                        const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                                                        connection.query(query3, function(err3, res3) {
                                                            if (err3) {
                                                                return reject3(err3)
                                                            } else {
                                                                console.log('Action with ID ' + row1['id'] + ' message: ' + res3.message)
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
                        } else if (row1['type_id'] == 6) {
                            return new Promise((resolve2, reject2) => {
                                const query2 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                                connection.query(query2, function(err2, res2) {
                                    if (err2) {
                                        return reject2(err2)
                                    } else {
                                        console.log('Action with ID ' + row1['id'] + ' message: ' + res2.message)
                                        resolve2(res2)
                                    }
                                })
                            })
                        }
                    })
                ).then(() => {
                    return new Promise((resolveEnd, rejectEnd) => {
                        connection.end( errEnd => {
                            if ( errEnd ) {
                                return rejectEnd(errEnd)
                            } else {
                                resolveEnd()
                            }
                        })
                    })
                }).then(() => {
                    resolve1()
                })
            }
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