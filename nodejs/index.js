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
