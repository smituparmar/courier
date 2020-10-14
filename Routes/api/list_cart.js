const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
var Product = require('../../models/Product');
const User = require('../../models/User');
var Cart = require('../../models/Cart');


//@route GET api/list cart
//@desc Test route
//@access Public
router.get('/',auth,
async (req,res) => {
    try {
        console.log(req.user.id)
        const user = await User.findById(req.user.id).select('-password');
        const cart = user.cart;
        return res.json(cart);  
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;