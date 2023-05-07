// Checking json web token
const jwt = require('jsonwebtoken')
const APIError = require('../errors/custom-error')
require('dotenv').config()

const authenticationMiddleware = async (req, res, next) => {
    const token = req.session.token
    if (!token) {
        // Auth error
        // throw new APIError('You do not have access to this site.')
        // return res.redirect('/login.html')
        return res.status(401).json({ msg: 'Log in to access this site.' })
    }
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const { username } = decoded
            if(username !== 'admin') {
                return res.status(401).send('Access denied. You do not have permission to access dashboard.')
            }
            next()
        } catch (err) {
            // return console.log('Invalid token.')
            return res.status(400).json({ msg: 'Invalid token.' })
            // throw new APIError('Invalid token.')
        }
    }
}

module.exports = { authenticationMiddleware }