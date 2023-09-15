const express = require("express")
const serverless = require('serverless-http')
const app = express()
const cors = require('cors')
const bcrypt = require("bcrypt")
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
    connection.query('SELECT house.id, house.name, family.name AS family_name FROM house INNER JOIN family ON family_id = family.id', function (err, rows) {
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
    connection.query('SELECT house.id, house.name, family.name AS family_name, house.food, house.wood FROM house INNER JOIN family ON family_id = family.id WHERE house.family_id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("ListFamilyHousesError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
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
    connection.query('SELECT house.id, house.name, house.rooms, house.storage, house.food, house.wood, house.family_id, COUNT(person.house_id) AS people FROM house INNER JOIN person ON person.house_id = house.id WHERE house.id = ' + req.params.id, function (err, rows) {
        if (err) {
            console.log("DescribeHouseError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            rows.map(function(row) {
                if (row['people'] == 0) {
                    connection.query('SELECT house.id, house.name, house.rooms, house.storage, house.food, house.wood, house.family_id FROM house WHERE house.id = ' + req.params.id, function (err, rows) {
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
    connection.query('SELECT person.id, person.partner_id, person.gender, person.family_id, person.house_id, house.rooms, house.food, (SELECT COUNT(*)FROM person WHERE house_id = ' + req.params.id + ') AS people, (SELECT count(id) FROM action WHERE person_id = person.id AND started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL) AS action_count FROM person INNER JOIN house ON person.house_id = house.id WHERE house_id = ' + req.params.id + ' AND father_id NOT IN (SELECT id FROM person WHERE house_id = ' + req.params.id + ') AND mother_id NOT IN (SELECT id FROM person WHERE house_id = ' + req.params.id + ') AND person.partner_id IS NOT NULL ORDER BY gender DESC;', function (err, rows) {
        if (err) {
            console.log("CreatePersonError: ", err)
            connection = require('./database.js')
            res.json({error: err})
        } else {
            const father = rows[0]
            const mother = rows[1]
            const gender = Math.floor(Math.random() * 2) == 0 ? 'male' : 'female'
            if (father.action_count == 0 && mother.action_count == 0 && rows.length == 2 && father.gender == 'male' && mother.gender == 'female' && father.family_id == mother.family_id && father.house_id == mother.house_id && mother.rooms > mother.people && mother.food >= 2 && father.partner_id == mother.id && mother.partner_id == father.id) {
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
            } else if (mother.food >= 2) {
                res.send({"success": false, "error": "Not enough food, there is " + mother.food + " food but 2 are needed!"})
            } else if (father.partner_id != mother.id) {
                res.send({"success": false, "error": "Not partners, father partner_id is " + father.partner_id + " but mother id is " + mother.id + "!"})
            } else if (mother.partner_id != father.id) {
                res.send({"success": false, "error": "Not partners, mother partner_id is " + mother.partner_id + " but father id is " + father.id + "!"})
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