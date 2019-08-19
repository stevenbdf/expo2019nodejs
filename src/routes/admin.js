const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const utils = require('../utils/utils')
const adminController = require('../controllers/adminController')

router.post('/login', adminController.login)
router.get('/get', utils.verifyToken, adminController.get)
router.put('/update', utils.verifyToken, adminController.update)
router.get('/getDocumentos', adminController.getDocumentos)
router.get('/unlockAllAdmins/:SECRET_PARAM', adminController.unlockAllAdmins)

module.exports = router