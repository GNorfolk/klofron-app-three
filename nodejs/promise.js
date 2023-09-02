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

const database = new Database( config );

// Query with all type_id options
database.query( 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 MINUTE < now();' )
    .then( rows => {
        console.log(rows)
        rows.map(row => {
            if (row['type_id'] == 0) {
                database.query( 'UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] )
            } else if (row['type_id'] == 1) {
                database.query( 'SELECT house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row['person_id'] )
                    .then( rows => {
                        if (rows[0].storage >= rows[0].food + rows[0].wood + 2) {
                            database.query( 'UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] + '; UPDATE house SET food = food + 2 WHERE id = (SELECT house_id FROM person WHERE id = ' + row['person_id'] + ');' )
                        } else {
                            database.query( 'UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] )
                        }
                    } )
            }
            // else if (row['type_id'] == 2) {
            //     database.query()
            // } else if (row['type_id'] == 3) {
            //     database.query()
            // } else if (row['type_id'] == 4) {
            //     database.query()
            // } else if (row['type_id'] == 5) {
            //     database.query()
            // } else if (row['type_id'] == 6) {
            //     database.query()
            // }
        } )
    } )
    .catch( err => {
        console.log(err)
    } )
    .finally( () => {
        database.close()
    } )

// Query with type_id equal to 0
database.query( 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE type_id = 0 AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 MINUTE < now();' )
    .then( rows => {
        console.log(rows)
        return Promise.all(
            rows.map(row => {
                database.query( 'UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] )
            } )
        )
    } )
    .catch( err => {
        console.log(err)
    } )
    .finally( () => {
        database.close()
    } )


// Example code from the internet
var pool = mysql.createConnection( config )
const query = 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE type_id = 0 AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 MINUTE < now();'
pool.query( query, function(err, rows, fields) {
    if (err) {
        console.log(err)
    } else {
        console.log(rows)
        const promises = rows.map(row => {
            return new Promise((resolve, reject) => {
                const query2 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row['id']
                pool.query(query2, function(err2, rows2, fields2) {
                    if (err2) {
                        console.log(err2) 
                    } else {
                        resolve(rows2)
                    }
                })
            })
        })
        Promise.all(promises)
        .then((someResult) => {
            const anotherPromise = Promise.all(
                someResult.map((someValues) => {
                    return Promise.all(
                        someValues.map(async (someValue) => {
                            const query3 = 'UPDATE action SET cancelled_at = NOW() WHERE id = ' + someValue['id']
                            let thirdPromise = new Promise((resolve3, reject3) => {
                                pool.query(query3, function(err3, rows3, fields3) {
                                    if (err3) {
                                        console.log(err3)
                                    } else {
                                        resolve3(rows3)
                                    }
                                })
                            })
                            return thirdPromise
                        })
                    )
                })
            ).then((thirdResult) => {
                console.log('I dunno bro')
            })
        })
    }
} )

// Query with type_id equal to 1
database.query( 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE type_id = 1 AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 MINUTE < now();' )
    .then( rows => {
        console.log(rows)
        return Promise.all(
            rows.map(row => {
                database.query( 'SELECT house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row['person_id'] )
                    .then( rows => {
                        if (rows[0].storage >= rows[0].food + rows[0].wood + 2) {
                            return database.query( 'UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] + '; UPDATE house SET food = food + 2 WHERE id = (SELECT house_id FROM person WHERE id = ' + row['person_id'] + ');' )
                        } else {
                            return database.query( 'UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] )
                        }
                    } )
            } )
        )
    } )
    .then( () => {
        database.close()
    } )

// Testing without if statement madness
database.query( 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE type_id = 1 AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 MINUTE < now();' )
    .then( rows => {
        console.log(rows)
        return Promise.all(
            rows.map(row => {
                database.query( 'SELECT house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row['person_id'] )
                    .then( rows => {
                        let promise = new Promise((resolve, reject) => {
                            database.query( 'UPDATE action SET completed_at = NOW() WHERE id = ' + rows[0]['id'], function(err, res) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    resolve(res)
                                }
                            } )
                        })
                        return promise
                    } )
            } )
        )
    } )
    .then( () => {
        database.close()
    } )

// Doing promises myself
connection = mysql.createConnection(config);
promise1 = new Promise((resolve1, reject1) => {
    const query1 = 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE type_id = 1 AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 1 MINUTE < now();'
    connection.query(query1, function(err1, rows1) {
        if (err1) {
            return reject1(err1)
        } else {
            console.log(rows1)
            Promise.all(
                rows1.map(row1 => {
                    return new Promise((resolve2, reject2) => {
                        const query2 = 'UPDATE action SET completed_at = NOW() WHERE id = ' + row1['id']
                        connection.query(query2, function(err2, res2) {
                            if (err2) {
                                return reject2(err2)
                            } else {
                                console.log(res2.message)
                                resolve2(res2)
                            }
                        })
                    })
                })
            )
            new Promise((resolveEnd, rejectEnd) => {
                connection.end( errEnd => {
                    if ( errEnd ) {
                        return rejectEnd(errEnd)
                    } else {
                        resolveEnd()
                    }
                })
            })
            resolve1(rows1)
        }
    })
})
