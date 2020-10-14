const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
var Product = require('../../models/Product');
const User = require('../../models/User');
var Cart = require('../../models/Cart');


//@route POST api/add_cart
//@desc add details into cart
//@access Private
router.post('/',[auth,[
    check('product_name','Product name is required').not().isEmpty(),
    check('quantity','please mention quantity').not().isEmpty()
]],
async (req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()});
        }
        const user = await User.findById(req.user.id).select('-password');
        const product = await Product.findOne({name:req.body.product_name});
        if(!product)
        {
            return res.status(404).json({msg:"No product with this name"});
        }
        console.log(req.user.id);
        cartItem = new Cart({
            product:product.id,
            quantity: req.body.quantity,
        });
    
        cartArray = await User.findOne({cart:{"$elemMatch":{product:product.id}}}).select('cart -_id');
        var flag=0;
        if(cartArray){
            cartArray.cart.forEach(cart => {
                if(cart.product==product.id){
                    cart.quantity+=req.body.quantity;
                    console.log(cart.quantity);
                    flag=1;
                }
            });
        }
        
        if(flag)
        {
            user.cart=cartArray.cart;
            await user.save();
        }
        
        else
        {
            user.cart.push(cartItem);
            await user.save();
        }
        return res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;