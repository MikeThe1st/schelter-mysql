require("dotenv").config()
const mysql = require('mysql2/promise')

const connectDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true
})


module.exports = {connectDB}