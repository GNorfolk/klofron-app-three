const express = require("express")
const serverless = require('serverless-http')
const app = express()
const cors = require('cors')
const bcrypt = require("bcryptjs")
const day_in_ms = 24 * 3600 * 1000
const hour_in_ms = 3600 * 1000
let connection = require('./database.js')
const saltRounds = 10;
const dotenv = require('dotenv').config()

app.use(cors({ origin: ['https://www.klofron.uk', 'https://old.klofron.uk'] }))
app.use(express.json())

if (process.env.ENV === 'local') {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
} else {
    module.exports.handler = serverless(app);
}

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
