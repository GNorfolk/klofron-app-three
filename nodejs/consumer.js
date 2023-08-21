const connection = require('./database.js')

function checkQueue() {
  connection.query('SELECT * FROM action WHERE started_at IS NOT NULL AND completed_at IS NULL AND cancelled_at IS NULL AND started_at + INTERVAL 8 HOUR < now();', function (err, rows) {
    if (err) {
      console.log("err: ", err)
    } else {
      console.log(rows)
      let count = 0
      let length = rows.length
      if (count >= length) { process.exit() } 
      for (let row of rows) {
        connection.query('UPDATE action SET completed_at = NOW() WHERE id = ' + row['id'], function (err, rows) {
          if (err) {
            console.log("err: ", err)
          } else {
            console.log("success: ", row['id'])
            count++
            if (count >= length) { process.exit() }
          }
        })
      }
    }
  })
}

checkQueue();