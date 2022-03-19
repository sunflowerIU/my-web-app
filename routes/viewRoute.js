const express = require('express')
const router = express()
const viewController = require('../controllers/viewController')


//1. main page
router.get('/',viewController.getMainPage)

//2. productpage
router.get('/product/:slug',viewController.getProduct)

//3. contact us
router.get('/contact-us',viewController.contactUs)

//4. signup
router.get('/auth',viewController.auth)






module.exports = router