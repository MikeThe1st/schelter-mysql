const {connectDB} = require('../db/connect')
const {generateQuery} = require('../db/query')

let params = ["any", "any", "any"]
let sort = "short"

// Handle query and sort in order to return right pets
const getFilteredProducts = async (req, res) => {
    try {
        const pool = await connectDB.getConnection()
        const [pets, fields] = await pool.query(generateQuery(params, sort))
        .catch((err) => {
            console.log(err)
        })
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
        res.status(500).json({msg: 'Interval server error'})
    }
}

// Posting data neeeded on server-side
const postParams = async (req,res) => {
    params = [req.body.param1, req.body.param2, req.body.param3]
    sort = req.body.sorting
    res.status(200).send(params)
}

module.exports = { getFilteredProducts, postParams }