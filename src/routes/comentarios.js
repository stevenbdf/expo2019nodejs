const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const utils = require('../utils/utils')
const comentariosController = require('../controllers/comentariosController')

router.post('/add', utils.verifyToken, comentariosController.add)
router.put('/update', utils.verifyToken, comentariosController.update)
router.delete('/delete/:idComentario', utils.verifyToken, comentariosController.delete)

module.exports = router