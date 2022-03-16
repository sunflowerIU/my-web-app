const express = require('express')
const router = express()
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')


//
router.post('/signup',authController.createUser)
router.post('/login',authController.login)

router.use(authController.protect)
router.get('/get-user/:id',userController.getUserById)
router.get('/get-all-users',userController.showAllUsers)
router.post('/logout',authController.logout)
router.patch('/update-my-password',authController.updateMyPassword)
router.post('/forgot-password',authController.forgotPassword)
router.post('/reset-password/:token',authController.resetPassword)
router.post('/delete-my-account',authController.deleteMyAccount)


module.exports = router