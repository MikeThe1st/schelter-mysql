const {connectDB} = require('../db/connect')
const {generateQuery} = require('../db/query')

let params = ["any", "any", "any"]

const getFilteredProducts = async (req, res) => {
    try {
        const params = getParams()
        const pool = await connectDB()
        // const connection = await pool.getConnection()
        const [pets, fields] = await pool.query(generateQuery(params[0], params[1], params[2]))
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

const postParams = async (req,res) => {
    params =[req.body.param1]
    params.push(req.body.param2)
    params.push(req.body.param3)
    console.log(params)
    res.send(params)
}

function getParams() {
    return params
}

module.exports = { getFilteredProducts, postParams }