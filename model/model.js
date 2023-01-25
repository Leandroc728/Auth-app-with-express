// Import the mysql module and initialize dotenv

const mysql = require('mysql2')
require('dotenv').config()

// Database configurations

let connection = mysql.createPool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = connection