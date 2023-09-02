const mysql = require( 'mysql' );

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "klofron-app-three",
    multipleStatements: true
}

// Query with all type_id options
connection = mysql.createConnection(config)
promise = new Promise((resolve1, reject1) => {
    const query1 = 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 SECOND < now();'
    connection.query(query1, function(err1, rows1) {
        if (err1) {
            return reject1(err1)
        } else {
            console.log('Number of actions: ' + rows1.length)
            return Promise.all(
                rows1.map(row1 => {
                    if (row1['type_id'] == 0) {
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
                    } else if (row1['type_id'] == 1) {
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

// Query with type_id equal to 0
connection0 = mysql.createConnection(config);
promise0 = new Promise((resolve1, reject1) => {
    const query1 = 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE type_id = 0 AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 SECOND < now();'
    connection0.query(query1, function(err1, rows1) {
        if (err1) {
            return reject1(err1)
        } else {
            console.log('Number of type zero actions: ' + rows1.length)
            return Promise.all(
                rows1.map(row1 => {
                    return new Promise((resolve2, reject2) => {
                        const query2 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                        connection0.query(query2, function(err2, res2) {
                            if (err2) {
                                return reject2(err2)
                            } else {
                                console.log('Action with ID ' + row1['id'] + ' message: ' + res2.message)
                                resolve2(res2)
                            }
                        })
                    })
                })
            ).then(() => {
                return new Promise((resolveEnd, rejectEnd) => {
                    connection0.end( errEnd => {
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

// Query with type_id equal to 1
connection1 = mysql.createConnection(config);
promise1 = new Promise((resolve1, reject1) => {
    const query1 = 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE type_id = 1 AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 SECOND < now();'
    connection1.query(query1, function(err1, rows1) {
        if (err1) {
            return reject1(err1)
        } else {
            console.log('Number of type one actions: ' + rows1.length)
            return Promise.all(
                rows1.map(row1 => {
                    return new Promise((resolve2, reject2) => {
                        const query2 = 'SELECT house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row1['person_id']
                        connection1.query(query2, function(err2, rows2) {
                            if (err2) {
                                return reject2(err2)
                            } else {
                                return Promise.all(
                                    rows2.map(row2 => {
                                        console.log('Action with ID ' + row1['id'] + ' has house stats: ' + JSON.stringify(row2))
                                        if (row2.storage >= row2.food + row2.wood + 2) {
                                            return new Promise((resolve3, reject3) => {
                                                const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id'] + '; UPDATE house SET food = food + 2 WHERE id = (SELECT house_id FROM person WHERE id = ' + row1['person_id'] + ');'
                                                connection1.query(query3, function(err3, res3) {
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
                                        } else {
                                            return new Promise((resolve3, reject3) => {
                                                const query3 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                                                connection1.query(query3, function(err3, res3) {
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
                })
            ).then(() => {
                return new Promise((resolveEnd, rejectEnd) => {
                    connection1.end( errEnd => {
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
