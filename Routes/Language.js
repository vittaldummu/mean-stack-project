const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const LanguageSchema = require("../model/Language");
const authorize = require("../middlewares/auth");
const { check, validationResult } = require('express-validator');
// User Type
router.post("/save_language",
    [
        check('language_name')
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
            const languages = new LanguageSchema({
                    language_name: req.body.language_name,
                    is_active: 'Y',
                    created:new Date()
            });
            languages.save().then((response) => {
                res.status(201).json({
                    message: "Data Saved Successfully",
                    result: response
                });
            });
        }
    });

router.route('/EditLanguage/:id').get(authorize, (req, res, next) => {
    UserTypeSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

router.get("/languagelist", async (req,res)=>{
  var response={status:false,msg:"",data:""};
 
  try {
      const results = await LanguageSchema.find({});
      response.status=true;
      response.data=results;
    } catch (err) {
      throw err;
    }
  res.send(response);
});

module.exports=router;