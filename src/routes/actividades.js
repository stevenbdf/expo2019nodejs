const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const utils = require('../utils/utils')
const actividadesController = require('../controllers/actividadesController')

router.post('/add', utils.verifyToken, actividadesController.add)
router.put('/update', utils.verifyToken, actividadesController.update)
router.put('/updateEstado', utils.verifyToken, actividadesController.updateEstado)
router.delete('/delete/:idActividad', utils.verifyToken, actividadesController.delete)

module.exports = router