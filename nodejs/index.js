const express = require("express")
const serverless = require('serverless-http')
const app = express()
const cors = require('cors')
const bcrypt = require("bcryptjs")
const day_in_ms = 24 * 3600 * 1000
const hour_in_ms = 3600 * 1000
let connection = require('./database.js')
const saltRounds = 10;

app.use(cors({ origin: 'https://www.klofron.uk' }))
app.use(express.json())

if (process.env.ENV === 'local') {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
} else {
    module.exports.handler = serverless(app);
}

app.get("/v1/list-people", (req, res, next) => {
    connection.query('SELECT person.id, person.name, person.gender, person.created_at, person.family_id, family.name AS family_name, house.name AS house_name FROM person INNER JOIN family ON person.family_id = family.id INNER JOIN house ON person.house_id = house.id', function (err, rows) {
        if (err) {
            console.log("ListPeopleError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            rows.map(function(row) {
                row['age'] = Math.floor(((new Date()).valueOf() - (new Date(row['created_at'])).valueOf()) / day_in_ms)
            })
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/list-families", (req, res, next) => {
    connection.query('SELECT id, name FROM family', function (err, rows) {
        if (err) {
            console.log("ListFamiliesError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/list-houses", (req, res, next) => {
    connection.query('SELECT house.id, house.name, family.name AS family_name FROM house INNER JOIN family ON family_id = family.id WHERE type_id = 0', function (err, rows) {
        if (err) {
            console.log("ListHousesError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/list-markets", (req, res, next) => {
    connection.query('SELECT house.id, house.name, family.name AS family_name FROM house INNER JOIN family ON family_id = family.id WHERE type_id = 1', function (err, rows) {
        if (err) {
            console.log("ListHousesError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/list-farms", (req, res, next) => {
    connection.query('SELECT house.id, house.name, family.name AS family_name FROM house INNER JOIN family ON family_id = family.id WHERE type_id = 2', function (err, rows) {
        if (err) {
            console.log("ListHousesError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/list-family-houses/:id", (req, res, next) => {
    const connQuery = `
        SELECT
            house.id, house.name, family.name AS family_name, house.land, house.type_id,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = house.id), 0) AS wood
        FROM house
            INNER JOIN family ON family_id = family.id
        WHERE house.family_id = ` + req.params.id
    connection.query(connQuery, function (err, rows) {
        if (err) {
            console.log("ListFamilyHousesError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            rows.map(function(row) {
                switch(row['type_id']) {
                    case 0: { row['type_name'] = "House"; break }
                    case 1: { row['type_name'] = "Market"; break }
                    case 2: { row['type_name'] = "Farm"; break }
                    default: { row['type_name'] = "Unknown"; break }
                }
            })
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/list-family-people/:id", (req, res, next) => {
    connection.query('SELECT person.id, person.name, person.gender, person.created_at, family.name AS family_name, house.name AS house_name FROM person INNER JOIN family ON person.family_id = family.id LEFT JOIN house ON person.house_id = house.id WHERE deleted_at IS NULL AND person.family_id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("ListFamilyPeopleError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            rows.map(function(row) {
                row['age'] = Math.floor(((new Date()).valueOf() - (new Date(row['created_at'])).valueOf()) / day_in_ms)
            })
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/list-person-houses/:id", (req, res, next) => {
    const selectQuery = `
        SELECT id, name
        FROM house
        WHERE
            family_id = (SELECT family_id FROM person WHERE id = ` + req.params.id + `) AND
            id != COALESCE((SELECT house_id FROM person WHERE id = ` + req.params.id + `), 0);`
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("ListPersonHousesError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/describe-family/:id", (req, res, next) => {
    connection.query('SELECT id, name FROM family WHERE id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("DescribeFamilyError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/describe-house/:id", (req, res, next) => {
    const selectQuery = `
        SELECT
            house.id, house.name, house.rooms, house.storage, house.family_id, COUNT(person.house_id) AS people,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = house.id), 0) AS wood,
            COALESCE((SELECT SUM(offered_volume) FROM trade WHERE house_id = house.id AND offered_type_id = 1 AND completed_at IS NULL AND cancelled_at IS NULL), 0) AS food_in_trade,
            COALESCE((SELECT SUM(offered_volume) FROM trade WHERE house_id = house.id AND offered_type_id = 2 AND completed_at IS NULL AND cancelled_at IS NULL), 0) AS wood_in_trade 
        FROM house
            INNER JOIN person ON person.house_id = house.id
        WHERE house.id = ` + req.params.id
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("DescribeHouseError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            rows.map(function(row) {
                if (row['people'] == 0) {
                    const nestedSelectQuery = `
                        SELECT
                            house.id, house.name, house.rooms, house.storage, house.family_id,
                            COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
                            COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = house.id), 0) AS wood,
                            COALESCE((SELECT SUM(offered_volume) FROM trade WHERE house_id = house.id AND offered_type_id = 1 AND completed_at IS NULL AND cancelled_at IS NULL), 0) AS food_in_trade,
                            COALESCE((SELECT SUM(offered_volume) FROM trade WHERE house_id = house.id AND offered_type_id = 2 AND completed_at IS NULL AND cancelled_at IS NULL), 0) AS wood_in_trade 
                        FROM house
                        WHERE house.id = ` + req.params.id
                    connection.query(nestedSelectQuery, function (err, rows) {
                        if (err) {
                            console.log("DescribeHouseErrorTwo: ", err)
                            connection = require('./database.js')
                            res.send({"success": false, "error": err})
                        } else {
                            rows.map(function(row) {
                                row['people'] = 0
                            })
                            res.send({"success": true, "data": rows})
                        }
                    })
                } else {
                    res.send({"success": true, "data": rows})
                }
            })
        }
    })
})

app.get("/v1/list-house-people/:id", (req, res, next) => {
    connection.query('SELECT person.id, person.name, person.gender, person.created_at, family.name AS family_name, house.name AS house_name, (SELECT started_at FROM action where person_id = person.id AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_started_at FROM person INNER JOIN family ON person.family_id = family.id INNER JOIN house ON person.house_id = house.id WHERE person.house_id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("ListHousePeopleError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            rows.map(function(row) {
                row['age'] = Math.floor(((new Date()).valueOf() - (new Date(row['created_at'])).valueOf()) / day_in_ms)
                if (row['action_started_at']) {
                    const hours = ((new Date(row['action_started_at'])).valueOf() - (new Date() - (8 * hour_in_ms)).valueOf()) / hour_in_ms
                    const minutes = hours > 1 ?  (hours - Math.floor(hours)) * 60 : hours * 60
                    row['action_time'] = Math.floor(hours) + "hrs " + Math.floor(minutes) + "mins"
                } else {
                    row['action_time'] = null
                }
            })
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/list-house-trades/:id", (req, res, next) => {
    connection.query('SELECT id, offered_type_id, offered_volume, requested_type_id, requested_volume FROM trade WHERE house_id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("ListHouseTradesError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            rows.map(function(row) {
                switch(row['offered_type_id']) {
                    case 1: { row['offered_type_name'] = "Food"; break }
                    case 2: { row['offered_type_name'] = "Wood"; break }
                    default: { row['offered_type_name'] = "Unknown"; break }
                }
                switch(row['requested_type_id']) {
                    case 1: { row['requested_type_name'] = "Food"; break }
                    case 2: { row['requested_type_name'] = "Wood"; break }
                    default: { row['requested_type_name'] = "Unknown"; break }
                }
            })
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/describe-person/:id", (req, res, next) => {
    const selectQuery = `
        SELECT
            person.id, person.name, person.gender, person.created_at,
            father.id AS father_id, father.name AS father_name, father_family.name AS father_family_name,
            mother.id AS mother_id, mother.name AS mother_name, mother_family.name AS mother_family_name,
            family.name AS family_name, house.id AS house_id, house.name AS house_name
        FROM person
            LEFT JOIN house ON person.house_id = house.id
            INNER JOIN family ON person.family_id = family.id
            INNER JOIN person AS father ON person.father_id = father.id
            INNER JOIN person AS mother ON person.mother_id = mother.id
            INNER JOIN family AS father_family ON father.family_id = father_family.id
            INNER JOIN family AS mother_family ON mother.family_id = mother_family.id
        WHERE person.id = ` + req.params.id
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("DescribePersonError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            rows.map(function(row) {
                row['age'] = Math.floor(((new Date()).valueOf() - (new Date(row['created_at'])).valueOf()) / day_in_ms)
            })
            res.send({"success": true, "data": rows})
        }
    })
})

app.get("/v1/describe-house-resources/:id", (req, res, next) => {
    const selectQuery = `
        SELECT
            id, name,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = house.id), 0) AS wood
        FROM house
        WHERE house.id = ` + req.params.id
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("DescribeHouseResourcesError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            res.send({"success": true, "data": rows})
            
        }
    })
})

// curl localhost:3001/v1/describe-person-actions/25

app.get("/v1/describe-person-actions/:id", (req, res, next) => {
    connection.query('SELECT * FROM action WHERE person_id = ' + req.params.id + ' ORDER BY started_at DESC LIMIT 6;', function (err, rows) {
        if (err) {
            console.log("DescribePersonActionsError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else if (rows.length == 0) {
            res.send({"success": false, "error": "No actions returned!"})
        } else {
            const latest_action = rows[0]
            rows.map(function(row) {
                row['finish_reason'] = row['completed_at'] != null ? "Completed" : row['cancelled_at'] != null ? "Cancelled" : null
                const days = ( (new Date()).valueOf() - (new Date(row['started_at'])).valueOf()) / day_in_ms
                const hours = days > 1 ? (days - Math.floor(days)) * 24 : days * 24
                const minutes = hours > 1 ? (hours - Math.floor(hours)) * 60 : hours * 60
                row['started_time_ago'] = Math.floor(days) + "days " + Math.floor(hours) + "hrs " + Math.floor(minutes) + "mins"
                switch(row['type_id']) {
                    case 1: { row['type_name'] = "Get Food"; break }
                    case 2: { row['type_name'] = "Get Wood"; break }
                    case 3: { row['type_name'] = "Increase Storage"; break }
                    case 4: { row['type_name'] = "Increase Rooms"; break }
                    case 5: { row['type_name'] = "Create House"; break }
                    case 6: { row['type_name'] = "Create Baby"; break }
                    default: { row['type_name'] = "Unknown"; break }
                }
            })
            if (latest_action.completed_at == null && latest_action.cancelled_at == null) {
                res.send({
                    "success": true,
                    "current_action": [rows[0]],
                    "previous_actions": rows.splice(1, 5)
                })
            } else {
                res.send({
                    "success": true,
                    "current_action": [],
                    "previous_actions": rows.splice(0, 5)
                })
            }
        }
    })
})

app.post('/v1/increase-food/:id', function(req, res) {
    connection.query('SELECT (SELECT count(id) FROM action WHERE person_id = ' + req.params.id + ' AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("IncreaseFoodError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            if (rows[0].action_count == 0) {
                const infinite = req.query.infinite | 0
                connection.query('INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (' + req.params.id + ', 1, NOW(), ' + infinite + ')', function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].action_count != 0) {
                res.send({"success": false, "error": "There is already " + rows[0].action_count + " action in progress!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/decrease-food/:id', function(req, res) {
    connection.query("SELECT COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = " + req.params.id + "), 0) AS food", function (err, rows) {
        if (err) {
            console.log("DecreaseFoodError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            if (rows[0].food > 0) {
                connection.query("UPDATE resource SET volume = volume - 1 WHERE type_name = 'food' AND house_id = " + req.params.id, function (err, rows) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].food < 1) {
                res.send({"success": false, "error": "There is " + rows[0].food + " food but at least 1 required!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/increase-wood/:id', function(req, res) {
    const selectQuery = `
        SELECT
            person.house_id,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
            (SELECT count(id) FROM action WHERE person_id = ` + req.params.id + ` AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count
        FROM person
            JOIN house ON person.house_id = house.id
        WHERE person.id = ` + req.params.id
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("IncreaseWoodError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            if (rows[0].food >= 1 && rows[0].action_count == 0) {
                const infinite = req.query.infinite | 0
                connection.query("INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (" + req.params.id + ", 2, NOW(), " + infinite + "); UPDATE resource SET volume = volume - 1 WHERE type_name = 'food' AND house_id = " + rows[0].house_id, function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].action_count != 0) {
                res.send({"success": false, "error": "There is already " + rows[0].action_count + " action in progress!"})
            } else if (rows[0].food < 1) {
                res.send({"success": false, "error": "Not enough food, only " + rows[0].food + " food remaining!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/decrease-wood/:id', function(req, res) {
    connection.query("SELECT COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = " + req.params.id + "), 0) AS wood", function (err, rows) {
        if (err) {
            console.log("DecreaseWoodError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            if (rows[0].wood > 0) {
                connection.query("UPDATE resource SET volume = volume - 1 WHERE type_name = 'wood' AND house_id = " + req.params.id, function (err, rows) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].wood < 1) {
                res.send({"success": false, "error": "There is " + rows[0].wood + " wood but at least 1 required!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/modify-house/increase-storage/:id', function(req, res) {
    const selectQuery = `
        SELECT
            house.storage, house.id,
            (SELECT count(id) FROM action WHERE person_id = ` + req.params.id + ` AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = house.id), 0) AS wood
        FROM person
            JOIN house ON person.house_id = house.id
        WHERE person.id = ` + req.params.id
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("IncreaseStorageError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            if (rows[0].action_count == 0 && rows[0].food >= 1 && rows[0].wood >= 3) {
                const infinite = req.query.infinite | 0
                insertQuery = `
                    INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (` + req.params.id + `, 3, NOW(), ` + infinite + `);
                    UPDATE resource SET volume = volume - 3 WHERE type_name = 'wood' AND house_id = ` + rows[0].id + `;
                    UPDATE resource SET volume = volume - 1 WHERE type_name = 'food' AND house_id = ` + rows[0].id
                connection.query(insertQuery, function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].action_count != 0) {
                res.send({"success": false, "error": "There is already " + rows[0].action_count + " action in progress!"})
            } else if (rows[0].food < 1) {
                res.send({"success": false, "error": "Not enough food, only " + rows[0].food + " food remaining!"})
            } else if (rows[0].wood < 3) {
                res.send({"success": false, "error": "Not enough wood, only " + rows[0].wood + " wood remaining and 3 required!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/modify-house/increase-rooms/:id', function(req, res) {
    selectQuery = `
        SELECT
            house.rooms, house.id,
            (SELECT count(id) FROM action WHERE person_id = ` + req.params.id + ` AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = house.id), 0) AS wood
        FROM person
            JOIN house ON person.house_id = house.id
        WHERE person.id = ` + req.params.id
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("IncreaseRoomsError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            if (rows[0].action_count == 0 && rows[0].food >= 1 && rows[0].wood >= 6) {
                const infinite = req.query.infinite | 0
                const insertQuery = `
                    INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (` + req.params.id + `, 4, NOW(), ` + infinite + `);
                    UPDATE resource SET volume = volume - 6 WHERE type_name = 'wood' AND house_id = ` + rows[0].id + `;
                    UPDATE resource SET volume = volume - 1 WHERE type_name = 'food' AND house_id = ` + rows[0].id
                connection.query(insertQuery, function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].action_count != 0) {
                res.send({"success": false, "error": "There is already " + rows[0].action_count + " action in progress!"})
            } else if (rows[0].food < 1) {
                res.send({"success": false, "error": "Not enough food, only " + rows[0].food + " food remaining!"})
            } else if (rows[0].wood < 6) {
                res.send({"success": false, "error": "Not enough wood, only " + rows[0].wood + " wood remaining and 6 required!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/create-person/:id', function(req, res) {
    selectQuery = `
        SELECT
            person.id, person.partner_id, person.gender, person.family_id, person.house_id, person.created_at, house.rooms,
            COALESCE((SELECT volume FROM resource WHERE type_name = 'food' AND house_id = house.id), 0) AS food,
            (SELECT COUNT(*) FROM person WHERE house_id = ` + req.params.id + `) AS people,
            (SELECT count(id) FROM action WHERE person_id = person.id AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count
        FROM person
            INNER JOIN house ON person.house_id = house.id
        WHERE
            house_id = ` + req.params.id + `
            AND father_id NOT IN (SELECT id FROM person WHERE house_id = ` + req.params.id + `)
            AND mother_id NOT IN (SELECT id FROM person WHERE house_id = ` + req.params.id + `)
            AND person.partner_id IS NOT NULL
        ORDER BY gender DESC;`
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("CreatePersonError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else if (rows.length > 2) {
            res.send({"success": false, "error": "Too many parents, there are " + rows.length + " of them!"})
        } else if (rows.length < 2) {
            res.send({"success": false, "error": "Not enough parents, there are " + rows.length + " of them!"})
        } else {
            const father = rows[0]
            const mother = rows[1]
            mother['age'] = Math.floor(((new Date()).valueOf() - (new Date(mother['created_at'])).valueOf()) / day_in_ms)
            const gender = Math.floor(Math.random() * 2) == 0 ? 'male' : 'female'
            if (father.action_count == 0 && mother.action_count == 0 && father.gender == 'male' && mother.gender == 'female' && father.family_id == mother.family_id && father.house_id == mother.house_id && mother.rooms > mother.people && mother.food >= 2 && father.partner_id == mother.id && mother.partner_id == father.id && mother.age < 50) {
                insertQuery = `
                    INSERT INTO action
                        (person_id, type_id, started_at)
                    VALUES
                        (` + mother.id + `, 6, NOW()), (` + father.id + `, 6, NOW());
                    UPDATE resource SET volume = volume - 2 WHERE type_name = 'food' AND house_id = ` + mother.house_id + `;
                    INSERT INTO person
                        (name, family_id, father_id, mother_id, gender, house_id)
                    VALUES
                        ('Baby', ` + father.family_id + `, ` + father.id + `, ` + mother.id + `, '` + gender + `', ` + father.house_id + `);`
                connection.query(insertQuery, function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (father.action_count > 0) {
                res.send({"success": false, "error": "The father already has " + father.action_count + " action in progress!"})
            } else if (mother.action_count > 0) {
                res.send({"success": false, "error": "The mother already has " + mother.action_count + " action in progress!"})
            } else if (father.gender != 'male') {
                res.send({"success": false, "error": "Incorrect father gender, father with id " + father.id + " has gender " + father.gender + "!"})
            } else if (mother.gender != 'female') {
                res.send({"success": false, "error": "Incorrect mother gender, mother with id " + mother.id + " has gender " + mother.gender + "!"})
            } else if (father.family_id != mother.family_id) {
                res.send({"success": false, "error": "Not matching family_id, father family_id is " + father.family_id + " and mother family_id is " + mother.family_id + "!"})
            } else if (father.house_id != mother.house_id) {
                res.send({"success": false, "error": "Not matching house_id, father house_id is " + father.house_id + " and mother house_id is " + mother.house_id + "!"})
            } else if (father.rooms <= father.people) {
                res.send({"success": false, "error": "Not enough rooms, there are " + mother.rooms + " rooms occupied by " + mother.people + " people!"})
            } else if (mother.food < 2) {
                res.send({"success": false, "error": "Not enough food, there is " + mother.food + " food but 2 are needed!"})
            } else if (father.partner_id != mother.id) {
                res.send({"success": false, "error": "Not partners, father partner_id is " + father.partner_id + " but mother id is " + mother.id + "!"})
            } else if (mother.partner_id != father.id) {
                res.send({"success": false, "error": "Not partners, mother partner_id is " + mother.partner_id + " but father id is " + father.id + "!"})
            } else if (mother.age >= 50) {
                res.send({"success": false, "error": "Mother too old, mother is " + mother.age + " years old but cannot be 50 or over!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/create-house/:id', function(req, res) {
    const selectQuery = `
        SELECT
            id, house_id,
            (SELECT volume FROM resource WHERE type_name = 'food' AND house_id = person.house_id) AS food,
            (SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = person.house_id) AS wood,
            (SELECT count(id) FROM action WHERE person_id = person.id AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count
        FROM person
        WHERE id = ` + req.params.id
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("CreateHouseError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            if (rows[0].wood >= 12 && rows[0].food >= 3 && rows[0].action_count == 0) {
                const infinite = req.query.infinite | 0
                const insertQuery = `
                    INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (` + req.params.id + `, 5, NOW(), ` + infinite + `);
                    UPDATE resource SET volume = volume - 12 WHERE type_name = 'wood' AND house_id = ` + rows[0].house_id + `;
                    UPDATE resource SET volume = volume - 3 WHERE type_name = 'food' AND house_id = ` + rows[0].house_id
                connection.query(insertQuery, function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].wood < 12) {
                res.send({"success": false, "error": "Not enough wood, only " + rows[0].wood + " wood remaining and 12 required!"})
            } else if (rows[0].food < 3) {
                res.send({"success": false, "error": "Not enough food, only " + rows[0].food + " food remaining and 3 required!"})
            } else if (rows[0].action_count > 0) {
                res.send({"success": false, "error": "There is already " + rows[0].action_count + " action in progress!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

// curl --request POST localhost:3001/v1/login --header "Content-Type: application/json" --data '{"email":"halpert@klofron.uk","password":"password"}'

app.post("/v1/login", (req, res)=> {
    connection.query("SELECT id, username, password, email, family_id FROM user WHERE email = '" + req.body.email + "';", async (err, result) => {
        if (result.length == 0) {
            res.send({"success": false, "error": "User not found by email!"})
        } else if (result.length > 1) {
            res.send({"success": false, "error": "Too many users found by email!"})
        } else if (await bcrypt.compare(req.body.password, result[0].password)) {
            res.send({
                "success": true,
                "id": result[0].id,
                "username": result[0].username,
                "email": result[0].email,
                "family_id": result[0].family_id
            })
        } else {
            // bcrypt.hash(result[0].password, saltRounds, (err, hash) => {
            //     console.log(hash)
            //   });
            res.send({"success": false, "error": "User password is incorrect!"})
        }
    })
})

// curl --request POST http://localhost:3000/v1/cancel-person-action/176

app.post("/v1/cancel-person-action/:id", (req, res, next) => {
    connection.query('SELECT id, started_at, cancelled_at, completed_at FROM action WHERE cancelled_at IS NULL AND completed_at IS NULL AND id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("CancelPersonActionError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else if (rows.length == 0) {
            res.send({"success": false, "error": "No current action returned!"})
        } else if (rows.length > 1) {
            res.send({"success": false, "error": "More than one current action returned!"})
        } else {
            const current_action = rows[0]
            connection.query("UPDATE action SET cancelled_at = NOW() WHERE id = " + current_action.id, function(err, result) {
                if(err) {
                    throw err
                } else {
                    res.send({"success": true})
                }
            })
        }
    })
})

// curl --request POST localhost:3001/v1/rename-person/29 --header "Content-Type: application/json" --data '{"name":"Garry"}'

app.post("/v1/rename-person/:id", (req, res, next) => {
    connection.query('SELECT id, name FROM person WHERE id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("RenamePersonError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else if (req.body.name.length == 0) {
            res.send({"success": false, "error": "Name too short!"})
        } else {
            connection.query("UPDATE person SET name = '" + req.body.name + "' WHERE id = " + rows[0].id, function(err, result) {
                if(err) {
                    throw err
                } else {
                    res.send({"success": true})
                }
            })
        }
    })
})

// curl --request POST localhost:3001/v1/rename-house/12 --header "Content-Type: application/json" --data '{"name":"SomeHouseName"}'

app.post("/v1/rename-house/:id", (req, res, next) => {
    connection.query('SELECT id, name FROM house WHERE id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("RenameHouseSelectError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else if (req.body.name.length == 0) {
            res.send({"success": false, "error": "Name too short!"})
        } else {
            connection.query("UPDATE house SET name = '" + req.body.name + "' WHERE id = " + rows[0].id, function(err, result) {
                if (err) {
                    console.log("RenameHouseUpdateError: ", err)
                    res.send({"success": false, "error": err})
                } else {
                    res.send({"success": true})
                }
            })
        }
    })
})

// curl --request POST localhost:3001/v1/move-person-house --header "Content-Type: application/json" --data '{"person_id":3, "house_id": 12, "food": 1, "wood", 1}'

app.post('/v1/move-person-house', function(req, res) {
    const selectQuery = `
        SELECT
            id, rooms,
            COALESCE((SELECT house_id FROM person WHERE id = ` + req.body.person_id + `), -1) AS origin_house_id,
            (SELECT volume FROM resource WHERE type_name = 'food' AND house_id = COALESCE((SELECT house_id FROM person WHERE id = ` + req.body.person_id + `), -1)) AS origin_house_food,
            (SELECT volume FROM resource WHERE type_name = 'wood' AND house_id = COALESCE((SELECT house_id FROM person WHERE id = ` + req.body.person_id + `), -1)) AS origin_house_wood,
            (SELECT COUNT(id) FROM person WHERE house_id = house.id) AS people,
            (SELECT count(id) FROM action WHERE person_id = ` + req.body.person_id + ` AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count,
            (SELECT count(id) FROM move_house WHERE person_id = ` + req.body.person_id + ` AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS move_count,
            (SELECT volume FROM resource WHERE type_name = 'food' AND person_id = ` + req.body.person_id + `) AS person_food,
            (SELECT volume FROM resource WHERE type_name = 'wood' AND person_id = ` + req.body.person_id + `) AS person_wood
        FROM house
        WHERE 
            family_id = (SELECT family_id FROM person WHERE id = ` + req.body.person_id + `);`
    connection.query(selectQuery, function (err, rows) {
        const myIndex = rows.map(a => a.id).indexOf(req.body.house_id)
        if (err) {
            console.log("MovePersonHouseSelectError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else if (myIndex == -1) {
            res.send({"success": false, "error": "House with id " + req.body.house_id + " not in [" + rows.map(a => a.id) + "] array of family houses!"})
        } else if (rows[myIndex].rooms <= rows[myIndex].people) {
            res.send({"success": false, "error": "House has " + rows[myIndex].people + " people and " + rows[myIndex].rooms + " rooms!"})
        } else if (rows[myIndex].action_count > 0) {
            res.send({"success": false, "error": "There is already " + rows[myIndex].action_count + " action in progress!"})
        } else if (rows[myIndex].move_count > 0) {
            res.send({"success": false, "error": "There is already " + rows[myIndex].move_count + " move in progress!"})
        } else if (rows[myIndex].origin_house_id == rows[myIndex].id) {
            res.send({"success": false, "error": "Origin house with ID " + rows[myIndex].origin_house_id + " is identical to destination house with ID " + rows[myIndex].id + "!"})
        } else if (rows[myIndex].origin_house_id == -1 && req.body.food + req.body.wood > 0 ) {
            res.send({"success": false, "error": "Person is of no fixed abode so cannot take " + req.body.food + " food and " + req.body.wood + " wood !"})
        } else if (req.body.food + 1 > rows[myIndex].origin_house_food) {
            res.send({"success": false, "error": "Person requires " + (req.body.food + 1) + " food but only " + rows[myIndex].origin_house_food + " food available!"})
        } else if (req.body.wood > rows[myIndex].origin_house_wood) {
            res.send({"success": false, "error": "Person is taking " + req.body.wood + " wood but only " + rows[myIndex].origin_house_wood + " wood available!"})
        } else if (rows[myIndex].person_food + rows[myIndex].person_wood > 0) {
            res.send({"success": false, "error": "Person already has  " + rows[myIndex].person_food + " food and " + rows[myIndex].person_wood + " wood on their person!"})
        } else {
            insertQuery = `
                UPDATE person SET house_id = NULL WHERE id = ` + req.body.person_id + `;
                UPDATE resource SET volume = volume - ` + req.body.food + ` WHERE type_name = 'food' AND house_id = ` + rows[myIndex].origin_house_id + `;
                UPDATE resource SET volume = volume - ` + req.body.wood + ` WHERE type_name = 'wood' AND house_id = ` + rows[myIndex].origin_house_id + `;
                UPDATE resource SET volume = volume + ` + req.body.food + ` WHERE type_name = 'food' AND person_id = ` + req.body.person_id + `;
                UPDATE resource SET volume = volume + ` + req.body.wood + ` WHERE type_name = 'wood' AND person_id = ` + req.body.person_id + `;
                INSERT INTO move_house
                    (person_id, origin_house_id, destination_house_id)
                VALUES
                    (` + req.body.person_id + `, ` + rows[myIndex].origin_house_id + `, ` + rows[myIndex].id + `);`
            connection.query(insertQuery, function(err, result) {
                if (err) {
                    console.log("MovePersonHouseUpdateError: ", err)
                    res.send({"success": false, "error": err})
                } else {
                    res.send({"success": true})
                }
            })
        }
    })
})

// curl --request POST localhost:3001/v1/create-proposal/43
app.post("/v1/create-proposal/:id", (req, res, next) => {
    connection.query('SELECT id FROM person WHERE id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("CreateProposalIdSelectError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            connection.query("INSERT INTO proposal (proposer_person_id) VALUES (" + req.params.id + ");", function(err, result) {
                if (err) {
                    console.log("CreateProposalIdUpdateError: ", err)
                    res.send({"success": false, "error": err})
                } else {
                    res.send({"success": true})
                }
            })
        }
    })
})

// curl --request POST localhost:3001/v1/create-proposal --header "Content-Type: application/json" --data '{"proposer_id": 39, "accepter_id": 42}'
app.post("/v1/create-proposal", (req, res, next) => {
    connection.query('SELECT id FROM person WHERE id IN (' + req.body.proposer_id + ', ' + req.body.accepter_id + ');', function (err, rows) {
        if (err) {
            console.log("CreateProposalSelectError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            connection.query('INSERT INTO proposal (proposer_person_id, accepter_person_id) VALUES (' + req.body.proposer_id + ', ' + req.body.accepter_id + ');', function(err, result) {
                if (err) {
                    console.log("CreateProposalUpdateError: ", err)
                    res.send({"success": false, "error": err})
                } else {
                    res.send({"success": true})
                }
            })
        }
    })
})

// curl --request POST localhost:3001/v1/accept-proposal/4 --header "Content-Type: application/json" --data '{"accepter_id": 42}'
app.post("/v1/accept-proposal/:id", (req, res, next) => {
    selectQuery = `
        SELECT
            proposal.id, proposal.proposer_person_id,
            accepter.id AS accepter_person_id,
            accepter.family_id AS accepter_family_id,
            accepter.house_id AS accepter_house_id
        FROM proposal
            INNER JOIN person accepter ON accepter.id = ` + req.body.accepter_id + `
        WHERE proposal.id = ` + req.params.id
    console.log("sel: " + selectQuery)
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("AcceptProposalIdSelectError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            insertQuery = `
                UPDATE person SET partner_id = ` + rows[0].proposer_person_id + ` WHERE id = ` + rows[0].accepter_person_id + `;
                UPDATE person SET
                    family_id = ` + rows[0].accepter_family_id + `,
                    house_id = ` + rows[0].accepter_house_id + `,
                    partner_id = ` + rows[0].accepter_person_id + `
                WHERE id = ` + rows[0].proposer_person_id + `;
                UPDATE proposal SET accepter_person_id = ` + rows[0].accepter_person_id + ` AND accepted_at = NOW() WHERE id = ` + req.params.id + `;`
            console.log("ins: " + insertQuery)
            connection.query(insertQuery, function(err, result) {
                if (err) {
                    console.log("AcceptProposalIdUpdateError: ", err)
                    res.send({"success": false, "error": err})
                } else {
                    res.send({"success": true})
                }
            })
        }
    })
})
