const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route POST api/add_user
//@desc Add new product
//@access Public
router.post('/',[
    check('username','userName is required').not().isEmpty(),
    check('password','password is required').not().isEmpty(),
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }

    const {username,password} = req.body;
    try {
        let user = await User.findOne({username:username});
        console.log(user);
        if(user)
        {
           return res.status(400).json({errors: [{msg:"User already exists"}]});
        }
        user = new User({
            username,
            password
        });

        await user.save();
        
        const payload = {
            user:{
                id: user.id,
            }
        }

        jwt.sign(
            payload,
            config.get('jwtsecret'),
            {expiresIn:3600000000},
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