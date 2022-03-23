const mongoose = require('mongoose')
const slugify = require('slugify')



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    summary: {
        type: String,
        required: [true, 'summary is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'The minimum length of description is 5'],

    },
    imageCover: {
        type: String,
        required: [true, 'Image cover is required']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    landArea: {
        type: String,
        required: [true, 'Area is required']
    },
    type: { //land or house
        type: String,
        required: [true, 'Type is required'],
        enum: ['land', 'house']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    roadWidth: String,
    plinthArea: String,
    bedroom: String,
    bathroom: String,
    floors: String,
    totalRoom: String, //in each floor
    slug:String


}, { ///options for schema
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    } ///required for virtual to show up in output)
})


//pre slugify middleware
productSchema.pre('save', function (next) {
    this.slug = slugify(this.name,{
        replacement:'-',
        lower:true,
        trim:true
    })

    next()
})








const Product = mongoose.model('product', productSchema)


module.exports = Product