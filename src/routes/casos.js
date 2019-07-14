const express = require('express')
const router = express.Router()
const casosController = require('../controllers/casosController')

router.get('/', casosController.read)
router.post('/add', casosController.add)
router.put('/update', casosController.update)
router.delete('/delete', casosController.delete)

module.exports = router