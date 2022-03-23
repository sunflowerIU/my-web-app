const User = require('../model/userModel')
const catchAsync = require('../utilities/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../utilities/appError')
const {
    promisify
} = require('util')
const Email = require('../utilities/email')
const crypto = require('crypto')



//create jwt token
const createAndSendToken = (user, req, res, msg) => {
    const id = user._id
    const token = jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    //set token to cookie
    res.cookie('jwt', token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true
    })

    //now set password and secretKey to undefined to hide from results
    user.password = undefined;
    user.secretKey = undefined;
    //send new user with token
    res.status(200).json({
        status: 'success',
        message: msg,
        user,
        token
    })

}



//1. create user(sign in)
exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        secretKey: req.body.secretKey,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    //create and send token to browser
    createAndSendToken(newUser, req, res, 'Following user has been created.')

    //send welcome email
    await new Email(newUser).welcomeEmail()

})




//2. login user
exports.login = catchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body

    //1. throw error if there is no email or password in body
    if (!email || !password) {
        return next(new AppError('Please provide email or password'), 400)
    }

    //2. find the user by that email
    const user = await User.findOne({
        email
    }).select('+password')

    //3. if there is no user by that email throw error and if password doesnot match
    if (!user || !await user.verifyPassword(password, user.password) || !user.active) {
        return next(new AppError('Incorrect email or password. Please try again!!!🙄🙄', 400))
    }

    //4. if everything goes alright then login the user by sending jwt
    createAndSendToken(user, req, res, 'Login successful!!!👍👍👍')
})




//3.protect middleware to know if the user is logged in or not and to protect routes
exports.protect = catchAsync(async (req, res, next) => {
    let token;

    //obtain token from postman
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else { //otherwise obtain token from cookies(when we are requesting from frontend)
        token = req.cookies.jwt //since we kept token name to jwt when signup or login
    }
    //if no token then send error
    if (!token) {
        return next(new AppError('You are not logged in, please log in!!', 401))
    }

    ///now veryfy that token if that token is not tampered and verify user
    //1. first decode that token using secret key
    const payload = promisify(jwt.verify) //promisify is used to replace the callback functions
    const decoded = await payload(token, process.env.JWT_SECRET, )
    // console.log(decoded)

    //2. verify user, if that user is still available or not
    const user = await User.findById(decoded.id)
    if (!user) {
        return next(new AppError('This user is not available!!!😐', 401))
    }

    //3. if user has changed password after being logged in then send error with pass has been changed please login in again
    if (user.passwordChangedAt) {
        const passwordChangedAt = parseInt((user.passwordChangedAt.getTime() / 1000), 10)

        if (passwordChangedAt > decoded.iat) {
            return next(new AppError('Password was changed recently, please log in again!!', 401))
        }
    }

    //4. if user is available then set user as currrent user
    req.user = user
    res.locals.user = user //for template engine


    return next()
})


//4. user logout 
//to logout user we can again send new empty cookie in response, which will replace old cookie with empty cookie and expire that in 1 millisecond 
exports.logout = (req, res, next) => {
    res.cookie('jwt', '', {
        maxAge: 1, //1 millisecond
        httpOnly: true
    })
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully!!!'
    })
}



//5. update password
exports.updateMyPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')


    //1.check if given password matches with user password
    //and send error if given password is incorrect
    if (!await user.verifyPassword(req.body.password, user.password)) {
        return next(new AppError('Incorrect password, try again!!!', 400))
    }

    //3. if password is correct then update password
    user.password = req.body.newPassword
    user.passwordConfirm = req.body.newPassword
    await user.save()

    // createAndSendToken(user, req, res, 'Password updated')
    res.status(200).json({
        status: 'success',
        message: 'password updated',
        user
    })
})




//6. forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1. get user with their email
    const user = await User.findOne({
        email: req.body.email
    })

    //2. send error if there is no user
    if (!user) return next(new AppError('cannot find user with that email', 404));

    //3. create reset token
    const resetToken = await user.createPasswordResetToken()
    await user.save({
        validateBeforeSave: false
    })
    try {
        //4. send email with reset url 
        let resetUrl; 
        if(process.env.NODE_ENV==='development'){
            resetUrl= `${req.protocol}://${req.get('host')}/api/user/reset-password/${resetToken}`

        }else{
            resetUrl= `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`
        }
        // resetUrl= `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`

        await new Email(user, resetUrl).sendPasswordResetEmail()

        res.status(200).json({
            status: 'success',
            message: 'We have sent password reset url to your email, please check your email!!'
        })
    } catch (err) {
        // if there is error in sending email then set everything to undefined
        user.passwordResetExpires = undefined
        user.passwordResetToken = undefined
        await user.save({
            validateBeforeSave: false
        })
    }
})

//7. reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1. first encrypt that token again so that we can compare it
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    // 2. find user with that hashed token
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gte: Date.now()
        }
    })
    //3. send error if there's no user or if token has expired
    if (!user) {
        return next(new AppError('Invalid token or your token has expired!!', 400))
    }

    if (!req.body.password || !req.body.passwordConfirm) {
        return next(new AppError('Please provide password and password confirm', 400))
    }
    //4. set new password
    if (req.body.password === req.body.passwordConfirm) {
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        user.passwordResetExpires = undefined
        user.passwordResetToken = undefined

        await user.save()
    }

    //5. send response
    res.status(200).json({
        status: 'success',
        message: 'Your password has been changed successfully, please go to login page'
    })
})



// 8. delete my account
exports.deleteMyAccount = catchAsync(async (req, res, next) => {
    const user = req.user

    if (!user.verifyPassword(req.body.password, user.password)) return next(new AppError('Your password is not correct', 400))
    
    user.active = false;
    await user.save({validateBeforeSave:false})


    res.status(200).json({
        status:'success',
        message:'Your account has been deleted successfully'
    })

})


//9 is logged in function that will help us to know if user is logged in or not in frontend
exports.isLoggedIn = catchAsync(async(req,res,next)=>{

    const token = req.cookies.jwt //since we kept token name to jwt when signup or login
    //if no token then send error
    if (!token) {
        return next()
    }

    ///now veryfy that token if that token is not tampered and verify user
    //1. first decode that token using secret key
    const payload = promisify(jwt.verify) //promisify is used to replace the callback functions
    const decoded = await payload(token, process.env.JWT_SECRET, )
    // console.log(decoded)

    //2. verify user, if that user is still available or not
    const user = await User.findById(decoded.id)
    if (!user) {
        return next()
    }

    //3. if user has changed password after being logged in then send error with pass has been changed please login in again
    if (user.passwordChangedAt) {
        const passwordChangedAt = parseInt((user.passwordChangedAt.getTime() / 1000), 10)

        if (passwordChangedAt > decoded.iat) {
            return next()
        }
    }

    //4. if user is available then set user as currrent user
    req.user = user
    res.locals.user = user //for template engine


    return next()
})