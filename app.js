const express = require("express")
const app = express()
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const bodyParser = require('body-parser')

app.use(express.static('./public'))
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// parse application/json
app.use(bodyParser.json())

// Routing
app.use('/', userRouter)

app.use('/login', adminRouter)
// app.post('/login', (req, res) => {
//     const { username, password } = req.body
//     console.log(username, password)
// })

const port = process.env.PORT || 3000

const start = async () => {
    try {
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()