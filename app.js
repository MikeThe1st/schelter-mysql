const express = require("express")
const app = express()
const mainRouter = require('./routes/main')
const bodyParser = require('body-parser')

app.use(express.static('./public'))
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// parse application/json
app.use(bodyParser.json())

// Routing
app.use('/', mainRouter)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()