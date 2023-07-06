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
  connection.query('select person.id, person.name, person.gender, person.created_at, person.family_id, family.name as family_name, house.name as house_name from person inner join family on person.family_id = family.id inner join house on person.house_id = house.id', function (err, rows) {
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

app.get("/api/people/list-families", (req, res, next) => {
  connection.query('select id, name from family', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/list-houses", (req, res, next) => {
  connection.query('select house.id, house.name, family.name as family_name from house inner join family on family_id = family.id', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/list-family-houses/:id", (req, res, next) => {
  connection.query('select house.id, house.name, family.name as family_name from house inner join family on family_id = family.id where house.family_id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/describe-family-houses/:id", (req, res, next) => {
  connection.query('select house.id, house.name, family.name as family_name, house.food, house.wood from house inner join family on family_id = family.id where house.family_id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/describe-family-members/:id", (req, res, next) => {
  connection.query('select person.id, person.name, person.gender, person.created_at, family.name as family_name, house.name as house_name from person inner join family on person.family_id = family.id inner join house on person.house_id = house.id where person.family_id = ' + req.params.id, function (err, rows) {
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

app.get("/api/people/describe-house-members/:id", (req, res, next) => {
  connection.query('select person.id, person.name, person.gender, person.created_at, family.name as family_name, house.name as house_name from person inner join family on person.family_id = family.id inner join house on person.house_id = house.id where person.house_id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.post('/api/people/get-food/:id', function(req, res) {
  connection.query('SELECT last_action FROM person WHERE id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      let time_delta = new Date() - new Date(rows[0].last_action)
      if (time_delta > 480000) {
        connection.query('UPDATE person SET last_action = CURRENT_TIMESTAMP where id = ' + req.params.id + '; UPDATE house SET food = food + 2 where id = (SELECT house_id from person where id = ' + req.params.id + ');', function(err, result) {
          if(err) throw err
        })
        res.send("success")
      } else {
        res.send(time_delta.toString())
      }
    }
  })
});

app.post('/api/people/get-wood/:id', function(req, res) {
  connection.query('select person.last_action, house.food from person join house on person.house_id = house.id where person.id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      let time_delta = new Date() - new Date(rows[0].last_action)
      if (time_delta > 480000 && rows[0].food > 0) {
        connection.query('UPDATE person SET last_action = CURRENT_TIMESTAMP where id = ' + req.params.id + '; UPDATE house SET wood = wood + 1, food = food - 1 where id = (SELECT house_id from person where id = ' + req.params.id + ');', function(err, result) {
          if(err) throw err
        })
        res.send({"success": true,"time_delta": time_delta, "food": rows[0].food})
      } else {
        res.send({"success": false,"time_delta": time_delta, "food": rows[0].food})
      }
    }
  })
});

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
