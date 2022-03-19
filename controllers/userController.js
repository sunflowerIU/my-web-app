const User = require('../model/userModel')
const AppError = require('../utilities/appError')
const catchAsync = require('../utilities/catchAsync')




//1. show all users
exports.showAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    if (!users) {
        return next(new AppError('Sorry there are no any users currently!!! ', 404))
    }

    res.status(200).json({
        status: 'success',
        Total: users.length,
        users
    })
})


// 2. show user by id
exports.getUserById = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new AppError('Sorry there\'s no user with that id!!!', 404))
    }

    res.status(200).json({
        status: 'success',
        user
    })
})

