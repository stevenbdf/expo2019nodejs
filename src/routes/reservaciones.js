const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const utils = require('../utils/utils')
const reservacionesController = require('../controllers/reservacionesController')

router.post('/add', utils.verifyToken, reservacionesController.add)

module.exports = router 