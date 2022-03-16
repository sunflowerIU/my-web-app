const express = require('express')
const router = express()
const viewController = require('../controllers/viewController')


//1. main page
router.get('/',viewController.getMainPage)







module.exports = router