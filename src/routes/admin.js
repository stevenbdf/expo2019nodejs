const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.post('/login', adminController.login)
router.get('/get', verifyToken, adminController.get)
router.put('/update', verifyToken, adminController.update)
router.get('/getDocumentos', adminController.getDocumentos)

function verifyToken(req, res, next) {
    //Get header value
    const bearerHeader = req.headers['authorization']
    //Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //Split at the space Bearer <access_token> that space
        const bearer = bearerHeader.split(' ')
        //Get token from array
        const bearerToken = bearer[1]
        req.token = bearerToken
        //Next middleware or function
        next()
    } else {
        //Forbidden or Prohibit
        res.json({
            status: 403,
            message: 'Forbidden',
            data: {
                message: 'Acceso denegado, usuario no autorizado'
            }
        })
    }
}

module.exports = router