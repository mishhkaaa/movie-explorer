const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/User');

const router=express.Router();

// Register a new user
router.post('/register', async(req, res)=>{
    try{
        const{username, email, password}=req.body;

        //basic validation
        if(!username || !email || !password) {
            return res.status(400).json({message: 'Please enter all fields'});
        }

        //Check if user exists
        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(400).json({message: 'User already exists'});

        //Hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);

        //Create new User
        const newUser=new User({username, email, password: hashedPassword});
        await newUser.save();

        //create JWT
        const token=jwt.sign(
            {userId: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        //return token + basic user info
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch(err){
        //duplicate key(unique index) handling
        if(err.code===11000){
            return res.status(400).json({message: 'User already exists'});
        }
        res.status(500).json({message: 'Server error'});
    }
});

//Login a user
router.post('/login', async(req,res)=>{
    try{
        const{email, password}=req.body;

        //Check if user exists
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message: 'Invalid credentials'});

        //Check password
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        //Generate JWT
        const token=jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.json({token, user: {id: user._id, username: user.username, email: user.email}});
    } catch(err){
        console.log('Login error:', err);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports=router;