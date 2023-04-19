const { connectDB } = require('../db/connect')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const fs = require('fs')

let params = []
let currentDb = undefined

// Logging user
const login = async (req, res) => {
    // Getting username and password from client-side then decoding it and pasting as query params
    try {
        const { username, password } = req.body

        const pool = await connectDB.getConnection()
        const [rows, fields] = await pool.execute('SELECT * FROM admins WHERE username = ?;', [username])
        pool.release()
        
        // Making sure that I'm getting one user and encoding matched user
        if (rows.length === 1) {
            const match = await bcrypt.compare(password, rows[0].password)
            console.log(match)
            // Saving token to express-session
            if(match) {
                const token = jwt.sign({username: username, password: rows[0].password}, process.env.JWT_SECRET)
                req.session.token = token
                return res.status(200).send('Successfull login')
            }
            return res.status(401).send('Access denied. You do not have permission to access dashboard.')
        }
        else if(rows.length === 0) {
            res.status(401).send('Invalid username')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal server error')
    }
}

// Loading dashboard page
const dashboard = (req, res) => {
    loadFile('./private/dashboard.html', res)
    console.log('Welcome to admin dashboard.')
}

// Loading to-adopt dashboard
const toAdopt = (req, res) => {
    loadFile('./private/to-adopt.html', res)
    console.log('Welcome to to-adopt DB dashboard.')
}

const adopted = (req, res) => {
    loadFile('./private/adopted.html', res)
    console.log('Welcome to adopted DB dashboard.')
}

function loadFile(path, response) {
    const data = fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err)
            response.status(500).send('Error during loading page.')
        }
        else {
            response.writeHead(200, {'Content-type': 'text/html'})
            response.write(data)
            response.end()
        }
    })
}

const adminActions = async (req, res) => {
    try {
        const { action, btnId, db } = req.body
        const pool = await connectDB.getConnection()
        if (db) currentDb = db

        // Editing values of specyfic pet
        if (action == 'edit') {
            const { editParams } = req.body
            let [pets, fields] = await pool.query(`SELECT * FROM ${currentDb} WHERE id="${btnId}"`)

            let editString = `UPDATE ${currentDb} SET `
            let propertyCounter = 0, toEdit = false
            if (pets.length === 1) {
                for (let property in pets[0]) {
                    if (editParams[propertyCounter]) {
                        if (toEdit) {
                            editString += ', '
                        }
                        toEdit = true
                        editString += `${property}="${editParams[propertyCounter]}"`
                    }
                    propertyCounter++
                }
                editString += ` WHERE id=${btnId};`
                console.log(editString)
                await pool.query(editString).catch((err) => {
                    console.log(err)
                })
                res.status(200).send(`Pet with id:${btnId} got edited.`)
            }
        }

        // If pet gets adopted then it gets removed from to_adopted and inserted into adopted DB
        else if (action == 'adopted') {
            const [pets, fields] = await pool.query(`SELECT * FROM ${currentDb} WHERE id="${btnId}";`)
            if (pets.length == 1) {
                await pool.query(`DELETE FROM ${currentDb} WHERE id="${btnId}";`)

                let opositeDb = undefined
                if (currentDb == 'to_adopt') opositeDb = 'adopted'
                else opositeDb = 'to_adopt'

                await pool.query(`INSERT INTO ${opositeDb} VALUES(${btnId}, "${pets[0].type}", "${pets[0].size}", "${pets[0].breed}", "${pets[0].here_since_date.toLocaleDateString()}");`)
                res.status(200).send(`Pet with id:${btnId} got adopted.`)
            }
        }

        // Deleting single pet (used in case of mistake)
        else if (action == 'delete') {
            await pool.query(`DELETE FROM ${currentDb} WHERE id="${btnId}";`)
                .catch((err) => {
                    console.log(err)
                })
            res.status(200).send(`Pet with id:${btnId} just got deleted`)
        }
        else {
            res.status(404).send('Action not found.')
        }
        pool.release()
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal server error')
    }
}

const insertPet = async (req, res) => {
    try {
        const { insertParams } = req.body
        const pool = await connectDB.getConnection()
        const { data } = await pool.query(`INSERT INTO to_adopt VALUES (${insertParams[0]}, "${insertParams[1]}", "${insertParams[2]}", "${insertParams[3]}", NOW());`)
        pool.release()
        res.status(200).send(`New pet with id:${insertParams[0]} got created.`)
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal server error')
    }
}

const adminSearch = async (req, res) => {
    try {
        const pool = await connectDB.getConnection()
            .catch((err) => {
                console.log(err)
            })
        console.log(params)

        // Generating query
        let edited = false
        let queryString = `SELECT * FROM ${currentDb}`
        if (params[0] != '') {
            queryString += ` WHERE id=${params[0]}`
            edited = true
        }
        if (params[1] != '') {
            if (edited) {
                queryString += ` AND type="${params[1]}"`
            }
            else {
                queryString += ` WHERE type="${params[1]}"`
                edited = true
            }
        }
        if (params[2] != '') {
            if (edited) {
                queryString += ` AND size="${params[2]}"`
            }
            else {
                queryString += ` WHERE size="${params[2]}"`
                edited = true
            }
        }
        if (params[3] != '') {
            if (edited) {
                queryString += ` AND breed="${params[3]}"`
            }
            else {
                queryString += ` WHERE breed="${params[3]}"`
                edited = true
            }
        }
        queryString += `;`
        console.log(queryString)
        const [pets, fields] = await pool.query(queryString)
        pool.release()
        const formatedData = pets.map(pet => ({
            id: pet.id,
            type: pet.type,
            size: pet.size,
            breed: pet.breed,
            // Temp solution, need to add time to db
            here_since_date: new Date(pet.here_since_date).toLocaleDateString()
        }))
        console.log(formatedData)

        res.status(200).json(formatedData)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Interval server error' })
    }
}

const postInputs = async (req, res) => {
    try {
        const { db, inputs } = req.body
        params = inputs
        currentDb = db
        res.status(200).send(`Posted inputs: ${params}`)
    } catch (err) {
        console.log(err)
    }
}


module.exports = { login, dashboard, adminActions, insertPet, adminSearch, postInputs, toAdopt, adopted }