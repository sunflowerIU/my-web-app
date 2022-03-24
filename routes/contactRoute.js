const express = require('express')
const contactController = require('./../controllers/contactController')
const router = express()


//
router.post('/',contactController.contactController)



module.exports = router