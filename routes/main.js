const express = require('express')
const router = express.Router()

// Import controllers here
const {getFilteredProducts, postParams} = require('../controllers/main')

router.route('/adopt').get(getFilteredProducts)
router.route('/post-params').post(postParams)
// router.route('/')

module.exports = router