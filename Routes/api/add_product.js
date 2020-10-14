const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const bodyParser = require('body-parser');
const add_product_middleware = require('../../middleware/add_product_middleware');
var Product = require('../../models/Product');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

router.use(express.json({extended:true}));
var urlencodedParser = bodyParser.urlencoded({extended: false});

const upload = multer({
    dest: "./images/"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });

  const handleError = (err, res) => {
    console.log(err.message);
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

//@route POST api/add_product
//@desc Add new product
//@access Public
router.post('/',[upload.single("image"), urlencodedParser,[
    check('name','Name is required').not().isEmpty(),
    check('quantity','quantity is required').not().isEmpty(),
    check('price','Price is required').not().isEmpty(),
    check('quantity',"quantity must be Integer").isDecimal(),
    check('price',"price must be Number").isInt(),
]],
async (req,res) => {
    //console.log(req);
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const {name,description,quantity,price} = req.body;
        const tempPath = req.file.path;
        const targetPath =  path.join(__dirname, `../../uploads/${name}.png`);
        console.log(req.file)
        let product = await Product.findOne({name:name});
        if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".PNG" ) {
            console.log(1);
            await fs.rename(tempPath, targetPath, err => {
              if (err) return handleError(err, res);
            });
          } else {
            fs.unlink(tempPath, err => {
              if (err) return handleError(err, res);
            });
          }
          image=targetPath;
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
        })
        await product.save();
        return res.json(product);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

    
});

module.exports = router;