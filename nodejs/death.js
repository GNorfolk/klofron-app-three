const mysql = require( 'mysql' );

config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "klofron-app-three",
    multipleStatements: true
}

function checkQueue(connection) {
    new Promise((resolve1, reject1) => {
        const query1 = 'SELECT * FROM person WHERE deleted_at IS NULL AND created_at + INTERVAL 100 DAY < NOW();'
        connection.query(query1, function(err1, rows1) {
            if (err1) {
                return reject1(err1)
            } else {
                console.log('Number of people about to die: ' + rows1.length)
                return Promise.all(
                    rows1.map(row1 => {
                        return new Promise((resolve2, reject2) => {
                            const query2 = `
                                UPDATE person SET deleted_at = NOW(), house_id = NULL WHERE id = ` + row1['id'] + `;
                                UPDATE action SET cancelled_at = NOW() WHERE completed_at IS NULL AND cancelled_at IS NULL AND person_id = ` + row1['id']
                            connection.query(query2, function(err2, res2) {
                                if (err2) {
                                    return reject2(err2)
                                } else {
                                    console.log('Person with ID ' + row1['id'] + ' and Name ' + row1['name'] + ' has been deleted!')
                                    resolve2(res2)
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