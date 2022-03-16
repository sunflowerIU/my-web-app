const productController = require('../controllers/productController')
const authController = require('../controllers/authController')
const express = require('express')
const router = express()



//assigning product routes
router.get('/all-products',productController.getAllProducts)

router.use(authController.protect)
router.get('/find-product/:id',productController.findProductById)
router.post('/create-product',productController.createProduct)
router.delete('/delete-product/:id',productController.deleteProductById)
router.patch('/update-product/:id',productController.updateProductById)



module.exports = router