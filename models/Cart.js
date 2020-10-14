const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
    quantity: {
        type:Number,
        require:true
    }

});

module.exports = Cart = mongoose.model('cart',CartSchema);
