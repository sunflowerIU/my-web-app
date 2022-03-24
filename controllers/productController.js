const Product = require('./../model/productModel')
const AppError = require('./../utilities/appError')
const catchAsync = require('./../utilities/catchAsync')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')

//product methods
// 1. show all products
exports.getAllProducts = catchAsync(async (req, res, next) => {
    const queryObj = {
        ...req.query
    }

    //to remove some query name from query
    const removeQuery = ['page', 'sort', 'limit', 'fields']
    removeQuery.forEach(el => {
        delete queryObj[el]
    });

    //1. get query from url and find alc to them
    let query = Product.find(req.query)
    query  = query.sort('-createdAt')

    //2. pagination
    const limit = +req.query.limit || 6
    const page = +req.query.page || 1;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit)

    //count total pages that is available
    const totalPages = Math.ceil(await Product.countDocuments() / limit)
    // console.log(req.query.page,totalPages)

    //if given page in query is more than total page than show error
    if (+req.query.page > totalPages) {
        return next(new AppError(`There are no pages more than ${totalPages}`, 404))
    }

    //then await that query
    const products = await query.select('-__v')
    res.status(200).json({
        status: 'success',
        total: products.length,
        products
    })

})



//2. create new product
exports.createProduct = catchAsync(async (req, res, next) => {
    let newData

    try {

        newData = {
            ...req.body
        }
        // console.log(newData)
        if (req.files) {
            const imageNames = req.files.images.map(el => el.filename)
            newData.imageCover = req.files.imageCover[0].filename
            newData.images = imageNames
        }

        const product = await Product.create(newData)

        res.status(200).json({
            status: 'success',
            product
        })
    } catch (err) {
        fs.unlink(`${__dirname}/../public/img/product/${newData.imageCover}`,()=>{
            console.log('file deleted')
        })
        setTimeout(deleteUpload,4000)
        function deleteUpload(){
        newData.images.forEach(el=> fs.unlink(`${__dirname}/../public/img/product/${el}`,()=>{
            console.log('file deleted')
        }))}
        next(err)
    }


})


//3. find product by id
exports.findProductById = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    //throw error if no product
    if (!product) {
        return next(new AppError('Product not found😫😪', 404))
    }


    res.status(200).json({
        status: 'success',
        product
    })
})


//4. delete product by id
exports.deleteProductById = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    //throw error if no product
    if (!product) {
        return next(new AppError('Product not found😫😪', 404))
    }


    res.status(200).json({
        status: 'success,Following product has been deleted',
        product
    })
})


//5. updating product
exports.updateProductById = catchAsync(async (req, res, next) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    //throw error if no product
    if (!updatedProduct) {
        return next(new AppError('Product not found😫😪', 404))
    }

    res.status(200).json({
        status: 'success',
        updatedProduct
    })
})


//6. upload photo for new property
//a. setting multer
const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('You can upload only image', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.upload = upload.fields([{
    name: 'imageCover',
    maxCount: 1
}, {
    name: 'images',
    maxCount: 4
}])

//b. setting sharp for editing
exports.resizePropertyPhoto = catchAsync(async (req, res, next) => {

    if (!req.files) return next()


    //set filename for cover image
    req.files.imageCover[0].filename = `property-imageCover-${Date.now()}-${req.user.id}.jpeg`

    //set filename for iamges
    for (const file of req.files.images) {
        file.filename = `image-${Date.now()}-${Math.floor(Math.random()*50)}.jpeg`
    }

    //process cover image
    await sharp(req.files.imageCover[0].buffer).resize(612, 528).toFormat('jpeg').jpeg({
        quality: 90
    }).toFile(`public/img/product/${req.files.imageCover[0].filename}`)

    //process images
    req.files.images.forEach(async el => {
        await sharp(el.buffer).resize(612, 528).toFormat('jpeg').jpeg({
            quality: 90
        }).toFile(`public/img/product/${el.filename}`)
    })
    next()
})

//7. delete product by using slug from body
exports.deleteProductBySlug = catchAsync(async (req, res, next) => {
    const product = await Product.findOneAndRemove({slug:req.body.slug})
    //throw error if no product
    if (!product) {
        return next(new AppError('Product not found😫😪', 404))
    }

    
    res.status(200).json({
        status: 'success,Following product has been deleted',
        product
    })
    
    
    //then delete photos of that property
     fs.unlink(`${__dirname}/../public/img/product/${product.imageCover}`,()=>{
         console.log('imagecover deleted')
     })
    
    product.images.forEach( el=>{
         fs.unlink(`${__dirname}/../public/img/product/${el}`,()=>{
             console.log('images deleted')
         })
    })
})

