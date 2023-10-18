const mysql = require( 'mysql' );
const http = require('http')

config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "klofron-app-three",
    multipleStatements: true
}

const apiHost = process.env.API_HOST || "localhost"
const apiPort = process.env.API_PORT || 3001
const apiMethod = "POST"

function checkQueue(connection) {
    return new Promise((resolve1, reject1) => {
        const query1 = 'SELECT id, person_id, origin_house_id, destination_house_id, started_at, completed_at, cancelled_at FROM move_house WHERE completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 8 HOUR < NOW();'
        connection.query(query1, function(err1, rows1) {
            if (err1) {
                return reject1(err1)
            } else {
                console.log('Number of moves: ' + rows1.length)
                return Promise.all(
                    rows1.map(row1 => {
                        console.log('Executing action with ID ' + row1['id'])
                        return new Promise((resolve3, reject3) => {
                            const query3 = 'UPDATE move_house SET completed_at = NOW() WHERE id = ' + row1['id'] + '; UPDATE person SET house_id = ' + row1['destination_house_id'] + ' WHERE id = ' + row1['person_id']
                            connection.query(query3, function(err3, res3) {
                                if (err3) {
                                    return reject3(err3)
                                } else {
                                    for (const msg of res3) {
                                        console.log('Action with ID ' + row1['id'] + ' message: ' + msg.message)
                                    }
                                    resolve3(res3)
                                }
                            })
                        })
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