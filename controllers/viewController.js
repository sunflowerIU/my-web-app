const Product = require('../model/productModel')
const User = require('../model/userModel')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')



//1. get main page
exports.getMainPage = catchAsync(async(req,res,next)=>{
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
    res.status(200).render('main',{
        title:'Real-Estate',
        products,
        totalPages,
        currentPage:page //here page will represent the current page we are at

    })

}

)