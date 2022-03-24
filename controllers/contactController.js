const catchAsync = require('./../utilities/catchAsync')
const Email = require('./../utilities/email')



//control the contact us , 
exports.contactController = catchAsync(async(req,res,next)=>{
    //1. first get all information from client side(name, email,message)
    const {name,email,subject,message} = req.body;
    // console.log(name,email,subject,message)
    
    await new Email('','',email,'amittamang421@gmail.com',subject,message,name).contactEmail()

    res.status(200).json({
        status:"success",
        message:"Thank you for contacting us"
    })
})