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

app.get("/api/people/list-people", (req, res, next) => {
  connection.query('SELECT person.id, person.name, person.gender, person.created_at, person.family_id, family.name AS family_name, house.name AS house_name FROM person INNER JOIN family ON person.family_id = family.id INNER JOIN house ON person.house_id = house.id', function (err, rows) {
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
  connection.query('SELECT id, name FROM family', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/list-houses", (req, res, next) => {
  connection.query('SELECT house.id, house.name, family.name AS family_name FROM house INNER JOIN family ON family_id = family.id', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/list-family-houses/:id", (req, res, next) => {
  connection.query('SELECT house.id, house.name, family.name AS family_name, house.food, house.wood FROM house INNER JOIN family ON family_id = family.id WHERE house.family_id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/list-family-people/:id", (req, res, next) => {
  connection.query('SELECT person.id, person.name, person.gender, person.created_at, family.name AS family_name, house.name AS house_name FROM person INNER JOIN family ON person.family_id = family.id INNER JOIN house ON person.house_id = house.id WHERE person.family_id = ' + req.params.id, function (err, rows) {
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

app.get("/api/people/describe-house/:id", (req, res, next) => {
  connection.query('SELECT house.id, house.name, house.rooms, house.storage, house.food, house.wood, house.family_id, COUNT(person.house_id) AS people FROM house INNER JOIN person ON person.house_id = house.id WHERE house.id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      res.json(rows)
    }
  })
})

app.get("/api/people/list-house-people/:id", (req, res, next) => {
  connection.query('SELECT person.id, person.name, person.gender, person.created_at, family.name AS family_name, house.name AS house_name FROM person INNER JOIN family ON person.family_id = family.id INNER JOIN house ON person.house_id = house.id WHERE person.house_id = ' + req.params.id, function (err, rows) {
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

app.get("/api/people/describe-person/:id", (req, res, next) => {
  connection.query('SELECT person.id, person.name, person.gender, father.id AS father_id, father.name AS father_name, father_family.name AS father_family_name, mother.id AS mother_id, mother.name AS mother_name, mother_family.name AS mother_family_name, person.created_at, family.name AS family_name, house.name AS house_name FROM person INNER JOIN family ON person.family_id = family.id INNER JOIN house ON person.house_id = house.id INNER JOIN person AS father ON person.father_id = father.id INNER JOIN person AS mother ON person.mother_id = mother.id INNER JOIN family AS father_family ON father.family_id = father_family.id INNER JOIN family AS mother_family ON mother.family_id = mother_family.id WHERE person.id = ' + req.params.id, function (err, rows) {
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

app.post('/api/people/increase-food/:id', function(req, res) {
  connection.query('SELECT person.last_action, house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      let time_delta = new Date() - new Date(rows[0].last_action)
      if (time_delta > 28800000 && (rows[0].storage >= rows[0].food + rows[0].wood + 2)) {
        connection.query('UPDATE person SET last_action = CURRENT_TIMESTAMP WHERE id = ' + req.params.id + '; UPDATE house SET food = food + 2 WHERE id = (SELECT house_id FROM person WHERE id = ' + req.params.id + ');', function(err, result) {
          if(err) throw err
        })
        res.send({"success": true})
      } else if (time_delta < 28800000) {
        res.send({"success": false, "error": "Time delta value of " + time_delta + " is too low!"})
      } else if (rows[0].storage < rows[0].food + rows[0].wood + 2) {
        res.send({"success": false, "error": "Not enough storage, only " + (rows[0].storage - rows[0].food - rows[0].wood) + " space remaining!"})
      } else {
        res.send({"success": false, "error": "Unknown API error occurred!"})
      }
    }
  })
});

app.post('/api/people/increase-wood/:id', function(req, res) {
  connection.query('SELECT person.last_action, house.food FROM person join house ON person.house_id = house.id WHERE person.id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      let time_delta = new Date() - new Date(rows[0].last_action)
      if (time_delta > 28800000 && rows[0].food > 0) {
        connection.query('UPDATE person SET last_action = CURRENT_TIMESTAMP WHERE id = ' + req.params.id + '; UPDATE house SET wood = wood + 1, food = food - 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + req.params.id + ');', function(err, result) {
          if(err) throw err
        })
        res.send({"success": true})
      } else if (time_delta < 28800000) {
        res.send({"success": false, "error": "Time delta value of " + time_delta + " is too low!"})
      } else if (rows[0].food < 1) {
        res.send({"success": false, "error": "Not enough food, only " + rows[0].food + " food remaining!"})
      } else {
        res.send({"success": false, "error": "Unknown API error occurred!"})
      }
    }
  })
});

app.post('/api/people/modify-house/increase-storage/:id', function(req, res) {
  connection.query('SELECT person.last_action, house.storage, house.food, house.wood FROM person join house ON person.house_id = house.id WHERE person.id = ' + req.params.id, function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      let time_delta = new Date() - new Date(rows[0].last_action)
      if (time_delta > 28800000 && rows[0].food > 0 && rows[0].wood >= 10) {
        connection.query('UPDATE person SET last_action = CURRENT_TIMESTAMP WHERE id = ' + req.params.id + '; UPDATE house SET wood = wood - 10, food = food - 1, storage = storage + 10 WHERE id = (SELECT house_id FROM person WHERE id = ' + req.params.id + ');', function(err, result) {
          if(err) throw err
        })
        res.send({"success": true})
      } else if (time_delta < 28800000) {
        res.send({"success": false, "error": "Time delta value of " + time_delta + " is too low!"})
      } else if (rows[0].food < 1) {
        res.send({"success": false, "error": "Not enough food, only " + rows[0].food + " food remaining!"})
      } else if (rows[0].wood < 10) {
        res.send({"success": false, "error": "Not enough wood, only " + rows[0].wood + " wood remaining and 10 required!"})
      } else {
        res.send({"success": false, "error": "Unknown API error occurred!"})
      }
    }
  })
});

// Parents: SELECT * FROM person WHERE house_id = 2 AND father_id NOT IN (SELECT id FROM person WHERE house_id = 2) AND mother_id NOT IN (SELECT id FROM person WHERE house_id = 2);
// Children: SELECT * FROM person WHERE house_id = 2 AND father_id IN (SELECT id FROM person WHERE house_id = 2) OR mother_id IN (SELECT id FROM person WHERE house_id = 2);

app.post('/api/people/create-person/:id', function(req, res) {
  connection.query('SELECT * FROM person WHERE house_id = ' + req.params.id + ' AND father_id NOT IN (SELECT id FROM person WHERE house_id = ' + req.params.id + ') AND mother_id NOT IN (SELECT id FROM person WHERE house_id = ' + req.params.id + ') ORDER BY gender DESC;', function (err, rows) {
    if (err) {
      console.log("err: ", err)
      res.json({error: err})
    } else {
      const father = rows[0]
      const mother = rows[1]
      if (rows.length == 2 && father.gender == 'male' && mother.gender == 'female' && father.family_id == mother.family_id && father.house_id == mother.house_id) {
        connection.query("INSERT INTO person (name, family_id, father_id, mother_id, gender, house_id) VALUES ('Clarence', " + father.family_id + ", " + father.id + ", " + mother.id + ", " +  "'male'" + ", " + father.house_id + ")", function(err, result) {
          if(err) throw err
        })
        res.send({"success": true})
      } else if (rows.length > 2) {
        res.send({"success": false, "error": "Too many parents, there are " + rows.length + " of them!"})
      } else if (rows.length < 2) {
        res.send({"success": false, "error": "Not enough parents, there are " + rows.length + " of them!"})
      } else if (father.gender != 'male') {
        res.send({"success": false, "error": "Incorrect father gender, father with id " + father.id + " has gender " + father.gender + "!"})
      } else if (father.gender != 'female') {
        res.send({"success": false, "error": "Incorrect mother gender, mother with id " + mother.id + " has gender " + mother.gender + "!"})
      } else if (father.family_id != mother.family_id) {
        res.send({"success": false, "error": "Not matching family_id, father family_id is " + father.family_id + " and mother family_id is " + mother.family_id + "!"})
      } else if (father.house_id != mother.house_id) {
        res.send({"success": false, "error": "Not matching house_id, father house_id is " + father.house_id + " and mother house_id is " + mother.house_id + "!"})
      } else {
        res.send({"success": false, "error": "Unknown API error occurred!"})
      }
    }
  })
});