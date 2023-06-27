const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const User=require('../models/User');
const jwt=require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
const JWT_SIGN=process.env.JWT_SIGN;
//Roter for signup no auth required localhost:5000/auth/createuser
router.post('/createuser',[body("email").isEmail(), body("password").isLength({ min: 5 })], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let user=await User.findOne({email:req.body.email});
      if(user){
          return res.status(401).json({errors:"User exists with the same email already"});
      }
      const salt=bcrypt.genSaltSync(10);
      const secPass=bcrypt.hashSync(req.body.password,salt);
      user=new User({
          name:req.body.name,
          email:req.body.email,
          password:secPass,
          coins:50
      })
      const saved=await user.save();
      const data={
          user:{
              id:saved.id
          }
      };
      var token = jwt.sign(data,JWT_SIGN);
      res.json({token});
    } catch (error) {
        console.error(error);
        res.status(401).json({error:error});
    }
  }
);
//router for login no auth required localhost:5000/auth/login
router.post('/login',[body("email").isEmail(), body("password").isLength({ min: 5 })],async(req,res)=>{
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let user=await User.findOne({email:req.body.email});
      if(!user){
        return res.status(401).json({errors:"Wrong Credentials"});
      }
      const comparision=await bcrypt.compare(req.body.password,user.password);
      if(!comparision){
        return res.status(401).json({errors:"Wrong Credentials"});
      }
      const data={
        user:{
            id:user.id
        }
      };
      var token=jwt.sign(data,JWT_SIGN);
      res.json({token});

    }catch (error) {
        console.error(error);
        res.status(401).json({error:error});
    }
});
//router for getting the info of the user auth required localhost:5000/auth/getuser
router.post('/getuser',fetchuser,async(req,res)=>{
    try {
        let user=await User.findById(req.user.id).select("-password");
        res.send(user);

    }catch (error) {
        console.error(error);
        res.status(401).json({error:error});
    }
});
module.exports=router;