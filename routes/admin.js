const express = require('express')
const router = express.Router()

const {login} = require('../controllers/admin')

router.route('/').post(login)

module.exports = router