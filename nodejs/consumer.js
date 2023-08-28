const connection = require('./database.js')

function checkQueue() {
  connection.query('SELECT id, person_id, type_id, started_at, completed_at, cancelled_at FROM action WHERE started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 8 HOUR < now();', function (err, rows) {
    if (err) {
      console.log("err: ", err)
    } else {
      console.log(rows)
      let count = 0
      let length = rows.length
      if (count >= length) { process.exit() } 
      for (let row of rows) {
        if (row['type_id'] == 0) {
          connection.query('UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'], function (action_err, action_rows) {
            if (action_err) {
              console.log("err: ", action_err)
            } else {
              console.log("success: ", row['id'])
              count++
              if (count >= length) { process.exit() }
            }
          })
        }
        // Increase Food
        else if (row['type_id'] == 1) {
          connection.query('SELECT house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row['person_id'], function (house_err, house_rows) {
            if (house_err) {
              console.log("err: ", house_err)
              res.json({error: house_err})
            } else {
              if (house_rows[0].storage >= house_rows[0].food + house_rows[0].wood + 2) {
                connection.query('UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] + '; UPDATE house SET food = food + 2 WHERE id = (SELECT house_id FROM person WHERE id = ' + row['person_id'] + ');', function (post_house_err, post_house_rows) {
                  if (post_house_err) {
                    console.log("err: ", post_house_err)
                  } else {
                    console.log("success: ", row['id'])
                    count++
                    if (count >= length) { process.exit() }
                  }
                })
              } else {
                connection.query('UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'], function (post_house_err, post_house_rows) {
                  if (post_house_err) {
                    console.log("err: ", post_house_err)
                  } else {
                    console.log("failure: ", row['id'])
                    count++
                    if (count >= length) { process.exit() }
                  }
                })
              }
            }
          })
        }
        // Increase Wood
        else if (row['type_id'] == 2) {
          connection.query('SELECT house.storage, house.food, house.wood FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row['person_id'], function (house_err, house_rows) {
            if (house_err) {
              console.log("err: ", house_err)
              res.json({error: house_err})
            } else {
              if (house_rows[0].storage >= house_rows[0].food + house_rows[0].wood + 2) {
                connection.query('UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] + '; UPDATE house SET wood = wood + 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + row['person_id'] + ');', function (post_house_err, post_house_rows) {
                  if (post_house_err) {
                    console.log("err: ", post_house_err)
                  } else {
                    console.log("success: ", row['id'])
                    count++
                    if (count >= length) { process.exit() }
                  }
                })
              } else {
                connection.query('UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'], function (post_house_err, post_house_rows) {
                  if (post_house_err) {
                    console.log("err: ", post_house_err)
                  } else {
                    console.log("failure: ", row['id'])
                    count++
                    if (count >= length) { process.exit() }
                  }
                })
              }
            }
          })
        }
        // Increase Storage
        else if (row['type_id'] == 3) {
          connection.query('SELECT house.storage FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row['person_id'], function (house_err, house_rows) {
            if (house_err) {
              console.log("err: ", house_err)
              res.json({error: house_err})
            } else {
              connection.query('UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] + '; UPDATE house SET storage = storage + 3 WHERE id = (SELECT house_id FROM person WHERE id = ' + row['person_id'] + ');', function (post_house_err, post_house_rows) {
                if (post_house_err) {
                  console.log("err: ", post_house_err)
                } else {
                  console.log("success: ", row['id'])
                  count++
                  if (count >= length) { process.exit() }
                }
              })
            }
          })
        }
        // Increase Rooms
        else if (row['type_id'] == 4) {
          connection.query('SELECT house.storage FROM person INNER JOIN house ON person.house_id = house.id WHERE person.id = ' + row['person_id'], function (house_err, house_rows) {
            if (house_err) {
              console.log("err: ", house_err)
              res.json({error: house_err})
            } else {
              connection.query('UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'] + '; UPDATE house SET rooms = rooms + 1 WHERE id = (SELECT house_id FROM person WHERE id = ' + row['person_id'] + ');', function (post_house_err, post_house_rows) {
                if (post_house_err) {
                  console.log("err: ", post_house_err)
                } else {
                  console.log("success: ", row['id'])
                  count++
                  if (count >= length) { process.exit() }
                }
              })
            }
          })
        }
      }
    }
  })
}

checkQueue();