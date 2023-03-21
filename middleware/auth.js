// Checking json web token
const jwt = require('jsonwebtoken')
const APIError = require('../errors/custom-error')
require('dotenv').config()

const authenticationMiddleware = async (req, res, next) => {
    const token = req.headers['token']
    if (!token) {
        // Auth error
        // throw new APIError('You do not have access to this site.')
        return res.status(401).json({ msg: 'You do not have access to this site.' })
    }
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if(decoded != 'admin') return res.status(403).json({msg: 'Access denied. You do not have permission to access dashboard.' })
            next()

        } catch (ex) {
            res.status(400).json({msg: 'Invalid token.' })
        }
    }
}

module.exports = { authenticationMiddleware }