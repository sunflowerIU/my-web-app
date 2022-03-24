const express = require('express')
const router = express()
const viewController = require('./../controllers/viewController')
const authcontroller = require('./../controllers/authcontroller')



//1. main page
router.get('/',authcontroller.isLoggedIn,viewController.getMainPage)

//2. productpage
router.get('/product/:slug',authcontroller.isLoggedIn,viewController.getProduct)

//3. contact us
router.get('/contact-us',authcontroller.isLoggedIn,viewController.contactUs)

//4. signup
router.get('/auth',viewController.auth)

//5. create Property
router.get('/create-property',authcontroller.protect,viewController.createProperty)


//5. my account page
router.get('/my-account',authcontroller.protect,viewController.account)


//6. forgot password
router.get('/forgot-password',viewController.forgotPassword)


//7. reset password
router.get('/reset-password/:token',viewController.resetPassword)


router.all('*',(req,res,next)=>{
    res.status(404).render('error',{
        title:'Page not found'
    })
}
)




module.exports = router