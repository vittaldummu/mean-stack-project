const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const CurrencySchema = require("../model/Currency");
const authorize = require("../middlewares/auth");
const { check, validationResult } = require('express-validator');
// User Type
router.post("/save_currency",
    [
        check('currency_name')
            .not()
            .isEmpty()
            .withMessage('Name must be atleast 3 characters long'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
       console.log(req.body);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        }
        else {
            const currency = new CurrencySchema({
                    currency_name: req.body.currency_name,
					country_name: req.body.country_name,
					currency_symbol: req.body.currency_symbol,
                    is_active: 'Y',
                    created:new Date()
            });
            currency.save().then((response) => {
                res.status(201).json({
                    message: "Data Saved Successfully",
                    result: response
                });
            });
        }
    });

router.route('/currencylist/:id').get(authorize, (req, res, next) => {
    CurrencySchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

router.get("/currencylist", async (req,res)=>{
  var response={status:false,msg:"",data:""};
 
  try {
      const results = await CurrencySchema.find({});
      response.status=true;
      response.data=results;
    } catch (err) {
      throw err;
    }
  res.send(response);
});

module.exports=router;