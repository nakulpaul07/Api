const express = require('express')
const UserController = require('../controller/UserController')
const checkUserAuth = require('../middleware/auth')
const cartegoryController = require('../controller/cartegory')
const ProductController = require('../controller/ProductController')
const router = express.Router()

// user contoller
router.get('/getalluser', UserController.getalluser)
router.post('/registerUser', UserController.registerUser)
router.post('/loginuser', UserController.loginuser)
router.post('/logout', UserController.logout)
router.post('/updatepassword', checkUserAuth, UserController.updatepassword)
router.post('/updateProfile', checkUserAuth, UserController.updateProfile)
router.post('/getALLUser', checkUserAuth, UserController.getALLUser)
router.post('/getSinleUser/:id', checkUserAuth, UserController.getSinleUser)


// cartegory
router.post('/createCategory', cartegoryController.createCategory)
router.post('/getAllCategories', cartegoryController.getAllCategories)
router.post('/getCategoryDetail/:id', cartegoryController.getCategoryDetail)



// Product Creat
router.post('/createProduct', ProductController.createProduct)
router.post('/getProductDetail/:id', ProductController.getProductDetail)
router.post('/getAdminProduct', ProductController.getAdminProduct)
router.post('/deleteProduct', ProductController.deleteProduct)
router.post('/updateProduct', ProductController.updateProduct)



















module.exports = router