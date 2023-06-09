const express = require('express')
const router = express.Router()

const {getFilteredProducts, postParams} = require('../controllers/main')
const {login, dashboard, adminActions, insertPet, adminSearch, postInputs, toAdopt, adopted} = require('../controllers/admin')
const {authenticationMiddleware} = require('../middleware/auth')

// User routes
router.route('/adopt').get(getFilteredProducts)
router.route('/post-params').post(postParams)

// Admin routes
router.route('/login').post(login)
router.route('/dashboard').get(authenticationMiddleware, dashboard)

router.route('/dashboard/adopted').get(authenticationMiddleware)
router.route('/dashboard/insert-pet').post(authenticationMiddleware, insertPet)

router.route('/dashboard/to-adopt').get(authenticationMiddleware, toAdopt)
router.route('/dashboard/to-adopt').post(authenticationMiddleware, adminActions)

router.route('/dashboard/adopted').get(authenticationMiddleware, adopted)
router.route('/dashboard/adopted').post(authenticationMiddleware, adminActions)

router.route('/dashboard/post-inputs').post(authenticationMiddleware, postInputs)
router.route('/dashboard/to-adopt/search').get(authenticationMiddleware, adminSearch)
router.route('/dashboard/edit-pet').put(authenticationMiddleware, adminActions)
router.route('/dashboard/adopted').put(authenticationMiddleware, adminActions)
// router.route('/dashboard/delete-pet').delete(adminActions)

router.route('/dashboard/adopted/search').post(authenticationMiddleware, postInputs)
router.route('/dashboard/adopted/search').get(authenticationMiddleware, adminSearch)

module.exports = router