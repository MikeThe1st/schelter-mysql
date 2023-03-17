require("dotenv").config()
const mysql = require('mysql2/promise')

let pool

async function connectDB() {
  if(pool) return pool
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true
    })
    console.log('Connected to MySQL')
    return pool
  } catch (err) {
    console.log(err)
  }
}


module.exports = {connectDB}