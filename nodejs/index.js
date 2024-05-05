const express = require("express")
const serverless = require('serverless-http')
const app = express()
const cors = require('cors')
const bcrypt = require("bcryptjs")
const day_in_ms = 24 * 3600 * 1000
const hour_in_ms = 3600 * 1000
let connection = require('./database.js')
const saltRounds = 10;

app.use(cors({ origin: ['https://www.klofron.uk', 'https://old.klofron.uk'] }))
app.use(express.json())

if (process.env.ENV === 'local') {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
} else {
    module.exports.handler = serverless(app);
}

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
                postQuery = `
                    INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (` + req.params.id + `, 3, NOW(), ` + infinite + `);
                    UPDATE resource SET volume = volume - 3 WHERE type_name = 'wood' AND house_id = ` + rows[0].id + `;
                    UPDATE resource SET volume = volume - 1 WHERE type_name = 'food' AND house_id = ` + rows[0].id
                connection.query(postQuery, function(err, result) {
                    if(err) {
                        console.log("IncreaseStorageInsertError: ", err)
                        res.send({"success": false, "error": err})
                    } else {
                        res.send({"success": true, "result": result})
                    }
                })
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
                const postQuery = `
                    INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (` + req.params.id + `, 4, NOW(), ` + infinite + `);
                    UPDATE resource SET volume = volume - 6 WHERE type_name = 'wood' AND house_id = ` + rows[0].id + `;
                    UPDATE resource SET volume = volume - 1 WHERE type_name = 'food' AND house_id = ` + rows[0].id
                connection.query(postQuery, function(err, result) {
                    if(err) {
                        console.log("IncreaseRoomsInsertError: ", err)
                        res.send({"success": false, "error": err})
                    } else {
                        res.send({"success": true, "result": result})
                    }
                })
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
                postQuery = `
                    INSERT INTO action
                        (person_id, type_id, started_at)
                    VALUES
                        (` + mother.id + `, 6, NOW()), (` + father.id + `, 6, NOW());
                    UPDATE resource SET volume = volume - 2 WHERE type_name = 'food' AND house_id = ` + mother.house_id + `;
                    INSERT INTO person
                        (name, family_id, father_id, mother_id, gender, house_id)
                    VALUES
                        ('Baby', ` + father.family_id + `, ` + father.id + `, ` + mother.id + `, '` + gender + `', ` + father.house_id + `);`
                connection.query(postQuery, function(err, result) {
                    if(err) {
                        console.log("CreatePersonInsertError: ", err)
                        res.send({"success": false, "error": err})
                    } else {
                        res.send({"success": true, "result": result})
                    }
                })
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
                const postQuery = `
                    INSERT INTO action (person_id, type_id, started_at, infinite) VALUES (` + req.params.id + `, 5, NOW(), ` + infinite + `);
                    UPDATE resource SET volume = volume - 12 WHERE type_name = 'wood' AND house_id = ` + rows[0].house_id + `;
                    UPDATE resource SET volume = volume - 3 WHERE type_name = 'food' AND house_id = ` + rows[0].house_id
                connection.query(postQuery, function(err, result) {
                    if(err) {
                        console.log("CreateHouseInsertError: ", err)
                        res.send({"success": false, "error": err})
                    } else {
                        res.send({"success": true, "result": result})
                    }
                })
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
    connection.query("SELECT id, username, password, email FROM user WHERE email = '" + req.body.email + "';", async (err, rows) => {
        try {
            if (rows.length == 0) {
                res.send({"success": false, "error": "User not found by email!"})
            } else if (rows.length > 1) {
                res.send({"success": false, "error": "Too many users found by email!"})
            } else if (await bcrypt.compare(req.body.password, rows[0].password)) {
                res.send({
                    "success": true,
                    "id": rows[0].id,
                    "username": rows[0].username,
                    "email": rows[0].email
                })
            } else {
                // bcrypt.hash(rows[0].password, saltRounds, (err, hash) => {
                //     console.log(hash)
                //   });
                res.send({"success": false, "error": "User password is incorrect!"})
            }
        }
        catch (error) {
            console.log("LoginFirstError: ", err)
            console.log("LoginSecondError: ", error)
            console.log("LoginErrorRows: ", rows)
            res.send({"success": false, "error": "An undefined error occurred!"})
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
                    res.send({"success": true, "result": result})
                }
            })
        }
    })
})

// curl --request POST localhost:3001/v1/accept-proposal --header "Content-Type: application/json" --data '{"proposer_id": 30, "accepter_id": 34}'
app.post("/v1/accept-proposal", (req, res, next) => {
    selectQuery = `
        SELECT
            proposal.id, proposal.proposer_person_id,
            accepter.id AS accepter_person_id,
            accepter.family_id AS accepter_family_id,
            accepter.house_id AS accepter_house_id
        FROM proposal
            INNER JOIN person accepter ON accepter.id = ` + req.body.accepter_id + `
        WHERE proposal.proposer_person_id = ` + req.body.proposer_id + ` AND cancelled_at IS NULL AND accepted_at IS NULL;`
    connection.query(selectQuery, function (err, rows) {
        if (err) {
            console.log("AcceptProposalIdSelectError: ", err)
            connection = require('./database.js')
            res.send({"success": false, "error": err})
        } else {
            postQuery = `
                UPDATE person SET partner_id = ` + rows[0].proposer_person_id + ` WHERE id = ` + rows[0].accepter_person_id + `;
                UPDATE person SET
                    family_id = ` + rows[0].accepter_family_id + `,
                    house_id = ` + rows[0].accepter_house_id + `,
                    partner_id = ` + rows[0].accepter_person_id + `
                WHERE id = ` + rows[0].proposer_person_id + `;
                UPDATE proposal SET accepter_person_id = ` + rows[0].accepter_person_id + `, accepted_at = NOW() WHERE id = ` + rows[0].id + `;`
            connection.query(postQuery, function(err, result) {
                if (err) {
                    console.log("AcceptProposalIdUpdateError: ", err)
                    res.send({"success": false, "error": err})
                } else {
                    res.send({"success": true, "result": result})
                }
            })
        }
    })
})
