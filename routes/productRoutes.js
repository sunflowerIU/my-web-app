const productController = require('./../controllers/productController')
const authController = require('./../controllers/authController')
const express = require('express')
const router = express()
const upload = require('./../controllers/productController').upload
const AppError = require('./../utilities/appError')

//assigning product routes
router.get('/all-products',productController.getAllProducts)

router.use(authController.protect)
router.get('/find-product/:id',productController.findProductById)

//creating property and with error handler when uploading
router.post('/create-product',function(req,res,next){
    upload(req,res,function(err){
        if(err){
          return  next(new AppError('only 4 images can be uploaded',400) )
        }
        next()
    })
},productController.resizePropertyPhoto,productController.createProduct)




router.delete('/delete-product/:id',productController.deleteProductById)
router.delete('/delete-product',productController.deleteProductBySlug)
router.patch('/update-product/:id',productController.updateProductById)



module.exports = router