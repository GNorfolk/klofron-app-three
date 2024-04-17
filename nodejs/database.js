const mysql = require('mysql')

config = {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "ka3",
    multipleStatements: true
}

const pool = mysql.createPool(config)

module.exports = pool