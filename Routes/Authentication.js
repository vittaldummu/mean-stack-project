const router= require("express").Router();
const User=require("../model/User");
const userSchema = require("../model/User");
const bcript=require("bcryptjs");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');

const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
    // if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    //   cb(null, true);
    // } else {
    //   cb(null, false);
    //   return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    // }
  }
});


const jwt=require("jsonwebtoken");

const ResetPassword = require("../model/ResetPassword");

const { ObjectId } = require("mongodb");




router.get('/',(req,res)=>{
  res.send("from authentication");
});

router.post('/',(req,res)=>{
    res.send(" Post from authentication");
  });

router.post('/adminlogin', async (req,res)=>{
var response={status:false,msg:"",token:"",};
  const user= await User.findOne({
    email : req.body.email
  });

  if(!user){
    response.msg="Email doesn't Exists";
    return res.send(response);
  }

  //// check password 

  const validpass= await bcript.compare(req.body.password,user.password)
  if(!validpass) {
    response.msg="Invalid password";
    return res.send(response);
  }
  response.status=true;
  response.UserDetail = user;
  const token= jwt.sign({_id:user._id},process.env.TOKEN_SECRET);

  response.token=token;

  res.header("auth-token",token).send(response);
   
});

router.post("/adminforgotpassword", async (req,res)=>{
  if (!req.body.email) {
    return res
    .status(500)
    .json({ message: 'Email is required' });
    }
    const user = await User.findOne({
    email:req.body.email
    });
    if (!user) {
    return res
    .status(409)
    .json({ message: 'Email does not exist' });
    }

    var resettoken=new ResetPassword({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex')});
    resettoken.save(function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }
      ResetPassword.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
      
      var transporter =nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
          user:process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from:process.env.EMAIL_USER,
        subject: 'Learning System Management',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        process.env.FRONTED_URL+'/adminresetpassword/' + resettoken.resettoken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      transporter.sendMail(mailOptions, (err, info) => {
        return res.status(200).send({message:"succuess"});
      })
      
    });
    

});

router.post('/adminresetpassword',async (req,res)=>{

  if (!req.body.token) {
    return res
    .status(500)
    .json({ message: 'Token is required' });
    }
    const user = await ResetPassword.findOne({
      resettoken: req.body.token
      });
      if (!user) {
      return res
      .status(409)
      .json({ message: 'Invalid URL' });
      }
      User.findOneAndUpdate({ _id: user._userId }).then(() => {
      res.status(200).json({ message: 'Token verified successfully.',status:true });
      }).catch((err) => {
      return res.status(500).send({ msg: err.message });
      });
    

});
router.post('/editprofile',async (req,res)=>{
  var response={status:false,msg:"",data:""}; 
  const id=req.body._id;
  let updatedteacher = {}
   updatedteacher=req.body;
   await Teacher.findByIdAndUpdate(id, updatedteacher, function(err, updatedData){
    if(err){
      res.status(400).send(err);
    }
    else {
      response.status=true;
      response.msg="Profile Updated  Successfully !!!";
       response.data=updatedData;
     return res.send(response);
    }
  });
})
router.post("/profilepchange",upload.single('certificate'), async (req,res,next)=>{
  
  var response={status:false,msg:"",data:""}; 
 
  const id=req.body._id;
  
  let updatedteacher = {}
      
  if(req.file.filename!='undefined'){
   updatedteacher.profile_image=req.file.filename;
  }
  
  await Teacher.findByIdAndUpdate(id, updatedteacher, function(err, updatedData){
    if(err){
      res.status(400).send(err);
    }
    else {
      response.status=true;
      response.msg="Profile Image Uploaded Successfully !!!";
       response.data=updatedData;
     return res.send(response);
    }
  });
 
 });

router.post('/changepassword', async (req,res)=>{
  var response={status:false,msg:"",data:""};
  const teacher= await Teacher.findOne({
    _id : ObjectId(req.body._teacherid)
  });

  if(!teacher){
    response.msg="Email doesn't Exists";
    return res.send(response);
  }

  //// check password 

  const validpass= await bcript.compare(req.body.current_password,teacher.password)
  if(!validpass) {
    response.msg="Invalid password";
    return res.send(response);
  }
  
  const salt= await bcript.genSalt(10);
  const hashedpassword= await bcript.hash(req.body.new_password,salt);
  Teacher.findByIdAndUpdate(req.body._teacherid, { password: hashedpassword }, function (err, docs) { 
    if (err){ 
        console.log(err) 
    } 
    else{ 
      response.status=true; 
      response.msg="Password Reset Successfully !!!";
      return res.send(response);
    } 
}); 

  
});


router.post('/adminRegistration', async (req,res)=>{


  const existemail= await User.findOne({
    email : req.body.email
  });
  if(existemail) return res.status(400).send("Email already exists");
 
  const salt= await bcript.genSalt(10);
  const hashedpassword= await bcript.hash(req.body.password,salt);
  const user=new userSchema({
    name : req.body.name,
    email : req.body.email,
    password :hashedpassword
  });
   /*const saveUser= user.save();
   console.log(saveUser);
    res.send(saveUser);*/
  try {
    const saveUser= await user.save();
    res.send(saveUser);
  } catch (error) {
    res.status(400).send(error);
  }
  res.send(" Post from adminRegistration");
});

router.get("/userlist", async (req,res)=>{
  var response={status:false,msg:"",data:""};
 
  try {
      const results = await User.find({});
      response.status=true;
      response.data=results;
    } catch (err) {
      throw err;
    }
  res.send(response);
});
module.exports=router;