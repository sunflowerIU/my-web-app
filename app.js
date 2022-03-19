const express = require('express')
const app = express()
const dotenv = require('dotenv')
const AppError = require('./utilities/appError')
const errorController = require('./controllers/errorController')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')
const path = require('path')


//importing routes
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const viewRoutes = require('./routes/viewRoute')
const contactRoute = require('./routes/contactRoute')


////set view engine
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'pug')
app.set('views', path.join('views'))

//to parse body from request
app.use(express.json({
    limit: '10kb' //express will throw error if there is more than 10kb in body
}))
app.use(morgan('dev'))
app.use(cookieParser()) //this will send cookie to server on every request

//config dotenv
dotenv.config({
    path: './config.env'
})




//mongo sanitize to prevent sql attack
app.use(mongoSanitize())

//use limiter to prevent ddos
const limiter = rateLimit({
    max: 100, //what is the maximum limit of request
    windowMs: 60 * 60 * 1000, //in what time, this means maximum 100 reqs per 1 hour
    message: 'Too many request from this IP, Please try again in 1 hour.'
})

//since limiter is now a middleware we can use it app.use
app.use('/api', limiter) //now it will work for every url starts with api

//use xss to prevent cross site scripting
app.use(xss())




////assigning routers for api
app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/contact-us', contactRoute)

//assgining router for views
app.use('/',viewRoutes)


//assign remaining routers
app.all('*', (req, res, next) => {
    next(new AppError('Page not found!!😥😥', 404)) //send eroor to next middleware which is error handler middleware at last
})


//this is a error handling middleware, express will automatically know this is error handling middleware if we add 4 arguments
app.use((err, req, res, next) => {
    //default values for error
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Failed'


    // there are two errors one for production and another for development
    //1. for development error 
    if (process.env.NODE_ENV === 'development') {
        errorController.sendDevelopmentErrors(err, req, res, next)
    }

    //2. for production error
    if (process.env.NODE_ENV === 'production') {
        //making new error object with previous error obj
        let error = {
            ...err
        }
        error.message = err.message

        ///for other errors
        //1. for duplicate errors
        if (err.code === 11000) {
            error = errorController.handleDuplicateError(error)
        }

        //2. for cast error which causes when we put invalid id
        if (err.message.startsWith('Cast')) {
            error = errorController.handleCastErrors(error)
        }

        //3. validation error
        if (err.stack.startsWith('ValidationError')) {
            error = errorController.handleValidationError(error)
        }


        // 4. jwt error
        if (err.message === 'jwt malformed') {
            error = errorController.handleJwtError(error)
        }

        errorController.sendProductionErrors(error, req, res, next)

    }


})


module.exports = app