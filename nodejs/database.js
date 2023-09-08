const mysql = require('mysql')

config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "klofron-app-three",
    multipleStatements: true
}

const pool = mysql.createPool(config)

module.exports = pool