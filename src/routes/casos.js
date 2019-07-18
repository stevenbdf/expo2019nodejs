const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const utils = require('../utils/utils')
const casosController = require('../controllers/casosController')

router.get('/get/:idCaso', utils.verifyToken, casosController.get)
router.get('/read', utils.verifyToken, casosController.read)
router.post('/add', utils.verifyToken, casosController.add)
router.put('/update', utils.verifyToken, casosController.update)
router.delete('/delete', utils.verifyToken, casosController.delete)

module.exports = router