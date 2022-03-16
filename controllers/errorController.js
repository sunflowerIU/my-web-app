const AppError = require('../utilities/appError')


//two types of error one for development and another for production
// 1. For development errors
exports.sendDevelopmentErrors = (err, req, res, next) => {
    // a. for api
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: `${err.status}`,
            message: `${err.message}`,
            stack: err.stack
        })
    }

    //b. for rendered website
    console.log('error :', err)
    return res.status(err.statusCode).json({
        title: `OOPS, something went wrong!!!😑`,
        message: `${err.message}`
    })

}


// 2. for production error
exports.sendProductionErrors = (err, req, res, next) => {


    // a. for api
    if (req.originalUrl.startsWith('/api')) {
        // when there is operational error like error in fetching data,wrong id input etc
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: `${err.status}`,
                message: `${err.message}`,
            })
        } else { //for programming error
            console.log('error:', err)
            return res.status(500).json({
                status: 'Error',
                title: `something went wrong!!!😐`
            })
        }
    }
    // b. for rendered website
    if (err.isOperational) {
        return res.status(err.statusCode).render({
            status: `Error`,
            message: err.message,
            title: `something went wrong!!!😐`
        })
    } else { //for programming error
        return res.status(500).json({
            status: 'Error',
            message: err.message,
            title: `something went wrong!!!😐`
        })
    }

}






///other mongo errors
// 1. duplicate errors
exports.handleDuplicateError = (err) => {
    const message = `${Object.keys(err.keyValue)[0]} should be unique, Please try again!!!`
    return new AppError(message, 400)
}

//2. cast errors
exports.handleCastErrors = err =>{
    const message = `Invalid product id, please try again!!!`
    return new AppError(message,401)
}


//3. validation error
exports.handleValidationError = (err)=>{
    const message = err.message.split(':')[2]
    return new AppError(message,400)
}


//4. jwt error
exports.handleJwtError = (err)=>{
    const message = `JWT malformed, please login again!!`;
    return new AppError(message,400)
}