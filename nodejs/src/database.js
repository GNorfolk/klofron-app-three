const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', //
  password: 'password', //
  database: 'my-database',
})
connection.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Database connected')
})
module.exports = connection