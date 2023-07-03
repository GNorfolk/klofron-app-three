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

app.get("/api/people", (req, res, next) => {
  connection.query('SELECT * FROM people', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
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
