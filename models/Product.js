const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description: {
        type:String
    },
    quantity: { 
        type: Number,
        required:true
    },
    price:{
        type:Number,
        required: true
    },
    image:{
        type:String,
        required:false
    }
})

module.exports = Product = mongoose.model('product',ProductSchema);