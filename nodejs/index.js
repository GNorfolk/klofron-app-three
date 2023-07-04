const express = require("express");
const connection = require('./database.js')
const serverless = require('serverless-http')

const app = express()

if (process.env.ENVIRONMENT === 'local') {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
} else {
  exports.handler = serverless(app);
}

app.get("/api/health-check", (req, res, next) => {
  res.json("backend response")
})

app.get("/api/users", (req, res, next) => {
  connection.query('SELECT * FROM users', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/list-people", (req, res, next) => {
  connection.query('select person.id, person.name, person.gender, person.created_at, family.name as family_name, household.name as household_name from person inner join family on person.family_id = family.id inner join household on person.household_id = household.id', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      rows.map(function(row) {
        row['age'] = Math.floor(((new Date()).valueOf() - (new Date(row['created_at'])).valueOf()) / 86400000);
      });
      res.json(rows)
    }
  })
})

app.get("/api/users/get-ids", (req, res, next) => {
  connection.query('SELECT id FROM users', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/users/get-user/:id", (req, res, next) => {
  connection.query('SELECT * FROM users WHERE id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})
