const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');

//@route POST api/sign_in
//@desc Authorize and return user
//@access Private
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
        if(!user)
        {
           return res.status(400).json({errors: [{msg:"invalid"}]});
        }

        if(user.password!=password)
        {
            return res.status(400).json({errors: [{msg:"invalid"}]});
        }
        
        const payload = {
            user:{
                id: user.id,
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

//@route GET api/auth
//@desc User data
//@access Public
router.get('/',auth,async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;