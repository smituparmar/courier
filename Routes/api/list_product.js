const express = require('express');
const router = express.Router();
var Product = require('../../models/Product');


//@route GET api/list_product
//@desc get all products
//@access Public
router.get('/',async (req,res) =>{
    try {
        const products = await Product.find().populate('products');
        res.json(products);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error'); 
    }
});

module.exports = router;