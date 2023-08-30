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

database.query( 'SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 8 HOUR < now();' ).then( rows => {
    console.log(rows)
    database.close()
} );

// database.query( 'SELECT * FROM some_table' )
//     .then( rows => database.query( 'SELECT * FROM other_table' ) )
//     .then( rows => database.close() );

// let someRows, otherRows
// database.query( 'SELECT * FROM some_table' )
//     .then( rows => {
//         someRows = rows;
//         return database.query( 'SELECT * FROM other_table' )
//     } )
//     .then( rows => {
//         otherRows = rows;
//         return database.close()
//     }, err => {
//         return database.close().then( () => { throw err; } )
//     } )
//     .then( () => {
//         // do something with someRows and otherRows
//     } )
//     .catch( err => {
//         // handle the error
//     } )
