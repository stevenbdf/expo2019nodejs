const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const utils = require('../utils/utils')
const clientesController = require('../controllers/clientesController')

router.get('/read', utils.verifyToken, clientesController.read)
router.post('/login', clientesController.login)
router.get('/get', utils.verifyToken, clientesController.get)
router.put('/update', utils.verifyToken, clientesController.update)

module.exports = router 