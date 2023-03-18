

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(username, password)    
        res.status(200).send({username, password})
    } catch (err) {
        console.log(err)
    }
}

module.exports = {login}