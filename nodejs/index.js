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
            res.json({error: err})
        } else {
            rows.map(function(row) {
                row['age'] = Math.floor(((new Date()).valueOf() - (new Date(row['created_at'])).valueOf()) / day_in_ms)
            })
            res.json(rows)
        }
    })
})

app.get("/v1/list-families", (req, res, next) => {
    connection.query('SELECT id, name FROM family', function (err, rows) {
        if (err) {
            console.log("ListFamiliesError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            res.json(rows)
        }
    })
})

app.get("/v1/list-houses", (req, res, next) => {
    connection.query('SELECT house.id, house.name, family.name AS family_name FROM house INNER JOIN family ON family_id = family.id WHERE type_id = 0', function (err, rows) {
        if (err) {
            console.log("ListHousesError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            res.json(rows)
        }
    })
})

app.get("/v1/list-markets", (req, res, next) => {
    connection.query('SELECT house.id, house.name, family.name AS family_name FROM house INNER JOIN family ON family_id = family.id WHERE type_id = 1', function (err, rows) {
        if (err) {
            console.log("ListHousesError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            res.json(rows)
        }
    })
})

app.get("/v1/list-farms", (req, res, next) => {
    connection.query('SELECT house.id, house.name, family.name AS family_name FROM house INNER JOIN family ON family_id = family.id WHERE type_id = 2', function (err, rows) {
        if (err) {
            console.log("ListHousesError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            res.json(rows)
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
            res.json({error: err})
        } else {
            rows.map(function(row) {
                switch(row['type_id']) {
                    case 0: { row['type_name'] = "House"; break }
                    case 1: { row['type_name'] = "Market"; break }
                    case 2: { row['type_name'] = "Farm"; break }
                    default: { row['type_name'] = "Unknown"; break }
                }
            })
            res.json(rows)
        }
    })
})

app.get("/v1/list-family-people/:id", (req, res, next) => {
    connection.query('SELECT person.id, person.name, person.gender, person.created_at, family.name AS family_name, house.name AS house_name FROM person INNER JOIN family ON person.family_id = family.id INNER JOIN house ON person.house_id = house.id WHERE person.family_id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("ListFamilyPeopleError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            rows.map(function(row) {
                row['age'] = Math.floor(((new Date()).valueOf() - (new Date(row['created_at'])).valueOf()) / day_in_ms)
            })
            res.json(rows)
        }
    })
})

app.get("/v1/list-person-houses/:id", (req, res, next) => {
    connection.query('SELECT id, name FROM house WHERE family_id = (SELECT family_id FROM person WHERE id = ' + req.params.id + ') AND id != (SELECT house_id FROM person WHERE id = ' + req.params.id + ')', function (err, rows) {
        if (err) {
            console.log("ListPersonHousesError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            res.json(rows)
        }
    })
})

app.get("/v1/describe-family/:id", (req, res, next) => {
    connection.query('SELECT id, name FROM family WHERE id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("DescribeFamilyError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            res.json(rows)
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
            res.json({error: err})
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
                            res.json({error: err})
                        } else {
                            rows.map(function(row) {
                                row['people'] = 0
                            })
                            res.json(rows)
                        }
                    })
                } else {
                    res.json(rows)
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
            res.json({error: err})
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
            res.json(rows)
        }
    })
})

app.get("/v1/list-house-trades/:id", (req, res, next) => {
    connection.query('SELECT id, offered_type_id, offered_volume, requested_type_id, requested_volume FROM trade WHERE house_id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("ListHouseTradesError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else if (rows.length == 0) {
            res.send({"success": false, "error": "No Actions returned!"})
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
            res.send({
                "success": true,
                "data": rows
            })
        }
    })
})

app.get("/v1/describe-person/:id", (req, res, next) => {
    connection.query('SELECT person.id, person.name, person.gender, father.id AS father_id, father.name AS father_name, father_family.name AS father_family_name, mother.id AS mother_id, mother.name AS mother_name, mother_family.name AS mother_family_name, person.created_at, family.name AS family_name, house.id AS house_id, house.name AS house_name FROM person INNER JOIN family ON person.family_id = family.id INNER JOIN house ON person.house_id = house.id INNER JOIN person AS father ON person.father_id = father.id INNER JOIN person AS mother ON person.mother_id = mother.id INNER JOIN family AS father_family ON father.family_id = father_family.id INNER JOIN family AS mother_family ON mother.family_id = mother_family.id WHERE person.id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("DescribePersonError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            rows.map(function(row) {
                row['age'] = Math.floor(((new Date()).valueOf() - (new Date(row['created_at'])).valueOf()) / day_in_ms)
            })
            res.json(rows)
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
            res.json({error: err})
        } else {
            res.json(rows)
        }
    })
})

// curl localhost:3001/v1/describe-person-actions/25

app.get("/v1/describe-person-actions/:id", (req, res, next) => {
    connection.query('SELECT * FROM action WHERE person_id = ' + req.params.id + ' ORDER BY started_at DESC LIMIT 6;', function (err, rows) {
        if (err) {
            console.log("DescribePersonActionsError: ", err)
            connection = require('./database.js')
            res.json({error: err})
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
    connection.query('SELECT (SELECT count(id) FROM action WHERE person_id = ' + req.params.id + ' AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS count FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("IncreaseFoodError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            if (rows[0].count == 0) {
                const infinite = req.query.infinite | 0
                connection.query('INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (' + req.params.id + ', 1, NOW(), ' + infinite + ')', function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].count != 0) {
                res.send({"success": false, "error": "There is already " + rows[0].count + " action in progress!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/decrease-food/:id', function(req, res) {
    connection.query('SELECT food FROM house WHERE id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("DecreaseFoodError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            if (rows[0].food > 0) {
                connection.query('UPDATE house SET food = food - 1 WHERE id = ' + req.params.id, function (err, rows) {
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
    connection.query('SELECT house.food, (SELECT count(id) FROM action WHERE person_id = ' + req.params.id + ' AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS count FROM person join house ON person.house_id = house.id WHERE person.id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("IncreaseWoodError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            if (rows[0].food >= 1 && rows[0].count == 0) {
                const infinite = req.query.infinite | 0
                connection.query('INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (' + req.params.id + ', 2, NOW(), ' + infinite + '); UPDATE house SET food = food - 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + req.params.id + ');', function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].count != 0) {
                res.send({"success": false, "error": "There is already " + rows[0].count + " action in progress!"})
            } else if (rows[0].food < 1) {
                res.send({"success": false, "error": "Not enough food, only " + rows[0].food + " food remaining!"})
            } else {
                res.send({"success": false, "error": "Unknown API error occurred!"})
            }
        }
    })
})

app.post('/v1/decrease-wood/:id', function(req, res) {
    connection.query('SELECT wood FROM house WHERE id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("DecreaseWoodError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            if (rows[0].wood > 0) {
                connection.query('UPDATE house SET wood = wood - 1 WHERE id = ' + req.params.id, function (err, rows) {
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
    connection.query('SELECT (SELECT count(id) FROM action WHERE person_id = ' + req.params.id + ' AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS count, house.storage, house.food, house.wood FROM person join house ON person.house_id = house.id WHERE person.id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("IncreaseStorageError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            if (rows[0].count == 0 && rows[0].food >= 1 && rows[0].wood >= 3) {
                const infinite = req.query.infinite | 0
                connection.query('INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (' + req.params.id + ', 3, NOW(), ' + infinite + '); UPDATE house SET wood = wood - 3, food = food - 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + req.params.id + ');', function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].count != 0) {
                res.send({"success": false, "error": "There is already " + rows[0].count + " action in progress!"})
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
    connection.query('SELECT (SELECT count(id) FROM action WHERE person_id = ' + req.params.id + ' AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS count, house.rooms, house.food, house.wood FROM person join house ON person.house_id = house.id WHERE person.id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("IncreaseRoomsError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            if (rows[0].count == 0 && rows[0].food >= 1 && rows[0].wood >= 6) {
                const infinite = req.query.infinite | 0
                connection.query('INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (' + req.params.id + ', 4, NOW(), ' + infinite + '); UPDATE house SET wood = wood - 6, food = food - 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + req.params.id + ');', function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].count != 0) {
                res.send({"success": false, "error": "There is already " + rows[0].count + " action in progress!"})
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
    connection.query('SELECT person.id, person.partner_id, person.gender, person.family_id, person.house_id, person.created_at, house.rooms, house.food, (SELECT COUNT(*) FROM person WHERE house_id = ' + req.params.id + ') AS people, (SELECT count(id) FROM action WHERE person_id = person.id AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count FROM person INNER JOIN house ON person.house_id = house.id WHERE house_id = ' + req.params.id + ' AND father_id NOT IN (SELECT id FROM person WHERE house_id = ' + req.params.id + ') AND mother_id NOT IN (SELECT id FROM person WHERE house_id = ' + req.params.id + ') AND person.partner_id IS NOT NULL ORDER BY gender DESC;', function (err, rows) {
        if (err) {
            console.log("CreatePersonError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            const father = rows[0]
            const mother = rows[1]
            mother['age'] = Math.floor(((new Date()).valueOf() - (new Date(mother['created_at'])).valueOf()) / day_in_ms)
            const gender = Math.floor(Math.random() * 2) == 0 ? 'male' : 'female'
            if (father.action_count == 0 && mother.action_count == 0 && rows.length == 2 && father.gender == 'male' && mother.gender == 'female' && father.family_id == mother.family_id && father.house_id == mother.house_id && mother.rooms > mother.people && mother.food >= 2 && father.partner_id == mother.id && mother.partner_id == father.id && mother.age < 50) {
                connection.query("INSERT INTO action (person_id, type_id, started_at) VALUES (" + mother.id + ", 6, NOW()), (" + father.id + ", 6, NOW()); UPDATE house SET food = food - 2 WHERE id = " + mother.house_id + "; INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id) VALUES ('Baby', " + father.family_id + ", " + father.id + ", " + mother.id + ", '" + gender + "', " + father.house_id + ");", function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (father.action_count > 0) {
                res.send({"success": false, "error": "The father already has " + father.action_count + " actions in progress!"})
            } else if (mother.action_count > 0) {
                res.send({"success": false, "error": "The mother already has " + mother.action_count + " actions in progress!"})
            } else if (rows.length > 2) {
                res.send({"success": false, "error": "Too many parents, there are " + rows.length + " of them!"})
            } else if (rows.length < 2) {
                res.send({"success": false, "error": "Not enough parents, there are " + rows.length + " of them!"})
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
    connection.query('SELECT wood, food FROM house WHERE id = (SELECT house_id FROM person WHERE id = ' + req.params.id + ');', function (err, rows) {
        if (err) {
            console.log("CreateHouseError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            if (rows[0].wood >= 12 && rows[0].food >= 3) {
                const infinite = req.query.infinite | 0
                connection.query("INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (" + req.params.id + ", 5, NOW(), " + infinite + "); UPDATE house SET wood = wood - 12, food = food - 3 WHERE id = (SELECT house_id FROM person WHERE id = " + req.params.id + ");", function(err, result) {
                    if(err) throw err
                })
                res.send({"success": true})
            } else if (rows[0].wood < 12) {
                res.send({"success": false, "error": "Not enough wood, only " + rows[0].wood + " wood remaining and 12 required!"})
            } else if (rows[0].food < 3) {
                res.send({"success": false, "error": "Not enough food, only " + rows[0].food + " food remaining and 3 required!"})
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
            res.json({error: err})
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
            res.json({error: err})
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
            res.send({"success": false, "error": "Unknown API error occurred!"})
        } else if (req.body.name.length == 0) {
            res.send({"success": false, "error": "Name too short!"})
        } else {
            connection.query("UPDATE house SET name = '" + req.body.name + "' WHERE id = " + rows[0].id, function(err, result) {
                if (err) {
                    console.log("RenameHouseUpdateError: ", err)
                    res.send({"success": false, "error": "Unknown API error occurred!"})
                } else {
                    res.send({"success": true})
                }
            })
        }
    })
})

// curl --request POST localhost:3001/v1/move-person-house --header "Content-Type: application/json" --data '{"person_id":3, "house_id": 12}'

app.post('/v1/move-person-house', function(req, res) {
    connection.query('SELECT id, rooms, (SELECT COUNT(id) FROM person WHERE house_id = house.id) AS people FROM house WHERE family_id = (SELECT family_id FROM person WHERE id = ' + req.body.person_id + ')', function (err, rows) {
        const myIndex = rows.map(a => a.id).indexOf(req.body.house_id)
        if (err) {
            console.log("MovePersonHouseSelectError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else if (myIndex == -1) {
            res.send({"success": false, "error": "House with id " + req.body.house_id + " not in [" + rows.map(a => a.id) + "] array of family houses!"})
        } else if (rows[myIndex].rooms <= rows[myIndex].people) {
            res.send({"success": false, "error": "House has " + rows[myIndex].people + " people and " + rows[myIndex].rooms + " rooms!"})
        } else {
            connection.query('UPDATE person SET house_id = ' + req.body.house_id + ' WHERE id = ' + req.body.person_id, function(err, result) {
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