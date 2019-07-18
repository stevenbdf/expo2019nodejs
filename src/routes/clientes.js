const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const utils = require('../utils/utils')
const clientesController = require('../controllers/clientesController')

router.get('/read', utils.verifyToken, clientesController.read)

module.exports = router 