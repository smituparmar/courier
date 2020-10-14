const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
var Product = require('../../models/Product');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route POST api/add_product
//@desc Add new product
//@access Public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('quantity','quantity is required').not().isEmpty(),
    check('price','Price is required').not().isEmpty(),
    check('quantity',"quantity must be Integer").isDecimal(),
    check('price',"price must be Integer").isInt(),
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }

    const {name,description,quantity,price,image} = req.body;
    try {
        let product = await Product.findOne({name:name});
        if(product)
        {
           return res.status(400).json({errors: [{msg:"Product already exists"}]});
        }
        product = new Product({
            name,
            description,
            quantity,
            price,
            image
        });

        await product.save();
        
        const payload = {
            product:{
                id: product.id,
            }
        }

        jwt.sign(
            payload,
            config.get('jwtsecret'),
            {expiresIn:3600000},
            (err,token)=>{
                if(err) throw err;
                res.json({token});

            }
            )

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

    
});

module.exports = router;