const User = require('../model/userModel')
const AppError = require('../utilities/appError')
const catchAsync = require('../utilities/catchAsync')
const multer = require('multer') //for file upload
const sharp = require('sharp') //for resizing image

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


//making filter object to filter from req.body
const filterObj = (obj, ...allowedFields) => {
    const filteredObj = {}

    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            filteredObj[el] = obj[el]
        }
    })
    return filteredObj
}



//3. update me
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('You cannot change your password here', 400))
    }

    let filteredObj = filterObj(req.body, 'email', 'name')

    if (req.file) {
        filteredObj.photo = req.file.filename
    }

    const updatedData = await User.findByIdAndUpdate(req.user.id,filteredObj)
    
    res.status(200).json({
        status:'success',
        message:'Updated successfully.'
    })
    
})



//4. for file upload using multer


//a. first sava file into buffer,so that we can resize them before uploading them
const multerStorage = multer.memoryStorage()

// b. make a multer filter
//this filter is done to check whether the uploaded file is really a image. since mimetype always starts with image if
//the file is image. so we can use that here
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('You can upload only image', 400), false)
    }
}


//c. now ready to upload file
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})


//d. now upload photo
exports.uploadUserPhoto = upload.single('photo')

//4.1 after file is uploaded we want to resize photo with sharp
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    // if no file then goto next middleware
    if (!req.file) return next()

    //set filename
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    //use sharp to edit other things
    await sharp(req.file.buffer).resize(300, 300).toFormat('jpeg').jpeg({
        quality: 90
    }).toFile(`public/img/user/${req.file.filename}`)

    next()

})