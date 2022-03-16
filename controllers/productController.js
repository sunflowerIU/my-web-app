const Product = require('../model/productModel')
const AppError = require('../utilities/appError')
const catchAsync = require('../utilities/catchAsync')



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


    //2. pagination
    const limit = +req.query.limit || 6
    const page = +req.query.page || 1;
    const skip = (page - 1 )* limit;
    query = query.skip(skip).limit(limit)

    //count total pages that is available
    const totalPages = Math.ceil(await Product.countDocuments()/limit)
    // console.log(req.query.page,totalPages)

    //if given page in query is more than total page than show error
    if(+req.query.page>totalPages){
        return next(new AppError(`There are no pages more than ${totalPages}`,404))
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

    const product = await Product.create(req.body)

    res.status(200).json({
        status: 'success',
        product
    })

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