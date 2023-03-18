const express = require('express')
const router = express.Router()

const {getFilteredProducts, postParams} = require('../controllers/main')

router.route('/adopt').get(getFilteredProducts)
router.route('/post-params').post(postParams)

module.exports = router