const {connectDB} = require('../db/connect')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fs = require('fs')

// Logging user
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
            // Saving token to express-session
            req.session.token = token
            res.status(200).send({encodedUsername, encodedPassword, token})
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal server error')
    }
}

// Reading dashboard page
const dashboard = async (req, res) => {
    fs.readFile('./private/dashboard.html', (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error loading page')
        } 
        else {
            res.write(data)
        }
      })
    console.log('Welcome to admin dashboard')
}

const adminActions = async (req, res) => {
    try {
        const {action, btnId} = req.body
        console.log(action, btnId)
        const pool = await connectDB()

        // Editing values of specyfic pet
        if(action == 'edit') {
            // TODO: Edit here
        }
        // If pet gets adopted then it gets removed from to_adopted and inserted into adopted DB
        else if(action == 'adopted') {
            const [pets, fields] = await pool.query(`SELECT * FROM to_adopt WHERE id="${btnId}";`)
            if(pets.length == 1) {
                await pool.query(`DELETE FROM to_adopt WHERE id="${btnId}";`)
                await pool.query(`INSERT INTO adopted VALUES(${btnId}, "${pets[0].type}", "${pets[0].size}", "${pets[0].breed}", "${pets[0].here_since_date.toLocaleDateString()}");`)
                const [test, fields] = await pool.query(`SELECT * FROM adopted WHERE id=${btnId};`)
                console.log(test)
            }
        }
        // Deleting single pet (used in case of mistake)
        else if(action == 'delete') {
            await pool.query(`DELETE FROM to_adopt WHERE id="${btnId}";`)
            .catch((err) => {
                console.log(err)
            })
            res.status(200).send(`Pet with id: ${btnId}, just got deleted.`)
        }
        else {
            res.status(404).send('Action not found.')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal server error')
    }
}


module.exports = {login, dashboard, adminActions}