const mongoose = require('mongoose')
const validator = require('validator')
const AppError = require('../utilities/appError')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please specify your name!'],
        trim: true,
        minlength: [4, 'Your name should have minimum 4 character!!!'],
        unique:[true,'This name is already taken.']

    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Please provide valid email.'],
        unique: [true, 'This email has already been taken']
    },
    password: {
        type: String,
        required: [true, 'Please set a password'],
        minlength: [8, 'Password must be minimum 8 characters'],
        select: false
    },
    secretKey: {
        type: String,
        required: [true, 'secret key is required'],
        trim: true,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please set a password confirm'],
        validate: {
            validator: function (passwordConfirm) {
                return this.password === passwordConfirm
            },
            message: 'Your password confirm does not match with password'
        },
        select: false

    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true
    }
})


///pre middlewares(pre-hooks)
//1. check secretKey before saving user
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10)
        this.passwordConfirm = undefined
        next()
    }
    next()
})


//2. check if provided secret key is true or not
userSchema.pre('save', function (next) {
    // if this doc is new then only check for secret key to save
    if (this.isNew) {
        //if secret key doesnot match then send error
        const SECRET_KEY_FOR_SIGNUP = 'my-secret-key'
        if (this.secretKey !== SECRET_KEY_FOR_SIGNUP) {
            return next(new AppError('Invalid secret key, you don\'t have permission to signin!!!', 400))
        }
        //if secret key is correct then hash secret key also
        this.secretKey = crypto.createHash('md5').update(this.secretKey).digest('hex')
        next()
    }
    next()
})





// 3. encrypt password and save it to database
userSchema.pre('save', function (next) {
    //if the password has not been modified and the user is new then simply run next middleware
    if (!this.isModified('password') || this.isNew) return next()

    //set password changed at to two second back because it will take time to make jwt token
    this.passwordChangedAt = Date.now() - 2000

    next()
})


//4. create method in userSchema to verify password with provided password vs saved password
userSchema.methods.verifyPassword = async (givenPassword, oldPassword) => {
    return await bcrypt.compare(givenPassword, oldPassword)
}


//5. create password reset token
userSchema.methods.createPasswordResetToken = async function () {
    //1. create a random token using builtin module called crypto
    const resetToken = crypto.randomBytes(32).toString('hex')

    //2. like password set that token to the database
    this.passwordResetToken = await crypto.createHash('sha256').update(resetToken).digest('hex')

    // 3. set password reset time in database
    this.passwordResetExpires = Date.now() + process.env.PASSWORD_RESET_EXPIRES * 60 * 1000

    return resetToken;
}


//4. find user only which are active
userSchema.pre(/^find/, function (next) {
    this.find({
        active: {
            $ne: false
        }
    })
    next()
})



const User = mongoose.model('User', userSchema)

module.exports = User