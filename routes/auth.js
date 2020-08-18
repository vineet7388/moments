const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const e = require('express');
const jwt  = require('jsonwebtoken');
const requireLogin = require("../middleware/requireLogin");

const {JWT_SECRET} = require('../config/keys');

router.post('/signup',(req,res)=>{
    const name =req.body.name;
    const email =req.body.email;
    const password =req.body.password;
    const pic =req.body.pic;
    console.log(req.body.pic);
    if(!email || !password || !name){
        return res.status(422).json({error:"Please enter all fields"})
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exist"})
        }
        bcrypt.hash(password,10)
        .then(hashedpassword=>{
            //console.log(hashedpassword);
            const user = new User({
                name,
                email,
                password:hashedpassword,
                pic
            })
    
            user.save()
            .then(user=>{
                res.json({message:"User Created"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Invalid Email or Password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or Password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Login Successful"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,pic} = savedUser
                res.json({token,user:{_id,name,email,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"});
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
})

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send('hello user');
// })

module.exports = router 