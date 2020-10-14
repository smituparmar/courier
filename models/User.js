const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    password:
    {
        type: String,
        required: true,
    },
    cart:{
        type:[
            {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product'
            },
            quantity: {
                type:Number,
                require:true
            }
        }
        ]
    }
});


module.exports = User = mongoose.model('user',UserSchema);