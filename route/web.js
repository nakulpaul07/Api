const express = require('express')
const UserController = require('../controller/UserController')
const router = express.Router()

// user contoller
router.get('/getalluser', UserController.getalluser)
router.post('/registerUser', UserController.registerUser)






module.exports = router