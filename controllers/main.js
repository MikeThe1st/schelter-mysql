const {connectDB} = require('../db/connect')
const {generateQuery} = require('../db/query')

let params = ["any", "any", "any"]
let sort = "short"

const getFilteredProducts = async (req, res) => {
    try {
        const pool = await connectDB()
        const [pets, fields] = await pool.query(generateQuery(params, sort))
        .catch((err) => {
            console.log(err)
        })

        const formatedData = pets.map(pet => ({
            type: pet.type,
            size: pet.size,
            breed: pet.breed,
            here_since_date: new Date(pet.here_since_date).toLocaleDateString()
        }))
        console.log(formatedData)
        res.status(200).json(formatedData)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Interval server error'})
    }
}

// Posting data neeeded on server-side
const postParams = async (req,res) => {
    params = [req.body.param1]
    params.push(req.body.param2)
    params.push(req.body.param3)
    sort = req.body.sorting
    res.status(200).send(params)
}

module.exports = { getFilteredProducts, postParams }