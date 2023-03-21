const {connectDB} = require('../db/connect')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const login = async (req, res) => {
    // Getting username and password from client-side then decoding it and pasting as query params
    try {
        const { username, password } = req.body
        const decodedUsername = jwt.sign(username, process.env.JWT_SECRET)
        const decodedPassword = jwt.sign(password, process.env.JWT_SECRET)
        const pool = await connectDB()
        const [rows, fields] = await pool.execute('SELECT * FROM admins WHERE username = ? AND password = ?', [decodedUsername, decodedPassword])

        // Making sure that I'm getting one user and encoding matched user
        if(rows.length == 1) {
            const encodedUsername = jwt.verify(rows[0].username, process.env.JWT_SECRET)
            const encodedPassword = jwt.verify(rows[0].password, process.env.JWT_SECRET)
            const token = decodedUsername
            res.status(200).send({encodedUsername, encodedPassword, token})
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal server error')
    }
}

module.exports = {login}