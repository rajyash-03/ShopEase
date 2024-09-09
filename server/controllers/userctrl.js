const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const express = require('express');
// const { patch } = require("../routes/useRouter");


const app = express();
app.use(express.json());
app.use(cookieParser());

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log("Request Body:", req.body);

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "Email already registered" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });

      //password encryption

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      //save mongodb
      await newUser.save();

      //CREATE JWT TOKEN TO AUTHENTICATION
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshtoken: async(req,res) => {

    try{
      // console.log('Cookies:');
      // console.log('Cookies:', req.cookies);
        const rf_token = req.cookies.refreshtoken;

        if(!rf_token) return res.status(400).json({msg:"Please Login or Registers!!!"});

        jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user) => {
            if(err) return res.status(400).json({msg:"Please Login or Register"})
            const accesstoken = createAccessToken({id:user.id})
        res.json({accesstoken})
        })

    }
    catch(err){
return res.status(500).json({msg:err.message})

  }
},
  login:async(req,res)=>{
    try{
        const{email,password}=req.body;

        const user=await Users.findOne({email})
        if(!user) return res.status(400).json({msg:"User does not exist"})

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({msg:'Incorrect Password'})

        const accesstoken= createAccessToken({id:user._id})
        const refreshtoken= createRefreshToken({id:user._id})

        res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            path:'/user/refresh_token'
        })

        // res.json({msg:"Login Success"})
        res.json({accesstoken})

    }catch(err){
       return res.status(500).json({msg:err.message})

    }
  },
  logout:async(req,res)=>{
    try{
        res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
        return res.json({msg:"Log Out"})

    }catch(err){
        // return res.status(500).json({msg:err.message})

    }
  },
  getUser:async(req,res)=>{
    try{
        const user=await Users.findById(req.user.id).select('-password')

        if(!user) return res.status(400).json({msg:"User Not Found"})
        res.json(user)
        // console.log(user)
      //  res.json(user)
    }catch(err){
        return res.status(500).json({msg:err.message})

    }
  }
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
module.exports = userCtrl;
