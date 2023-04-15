const express = require('express')
const router = express.Router()

const {getFilteredProducts, postParams} = require('../controllers/main')
const {login, dashboard, adminActions, insertPet} = require('../controllers/admin')
const {authenticationMiddleware} = require('../middleware/auth')

// User routes
router.route('/adopt').get(getFilteredProducts)
router.route('/post-params').post(postParams)

// Admin routes
router.route('/login').post(login)
router.route('/dashboard').get(authenticationMiddleware, dashboard)
router.route('/dashboard/to-adopt').get(authenticationMiddleware)
router.route('/dashboard/to-adopt').post(adminActions)
router.route('/dashboard/insert-pet').post(insertPet)
router.route('/dashboard/adopted').get(authenticationMiddleware)

module.exports = router