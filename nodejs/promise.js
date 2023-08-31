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
                        database.query( 'UPDATE action SET completed_at = NOW() WHERE id = ' + rows[0]['id'] )
                    } )
            } )
        )
    } )
    .then( () => {
        database.close()
    } )