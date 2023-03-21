const express = require('express')
const router = express.Router()

const {getFilteredProducts, postParams} = require('../controllers/main')
const {login} = require('../controllers/admin')
const {authenticationMiddleware} = require('../middleware/auth')

// User routes
router.route('/adopt').get(getFilteredProducts)
router.route('/post-params').post(postParams)

// Admin routes
router.route('/login').post(login)
router.route('/dashboard.html').get(authenticationMiddleware)

module.exports = router