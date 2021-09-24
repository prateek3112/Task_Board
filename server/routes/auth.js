const express = require("express");
const jwt = require("jsonwebtoken");
require("../db/connection");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
path = require('path');
const {cloudinary} = require('../cloudinary');



router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ Error: "Enter the Details" });
  }
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

     
      if (isMatch) {
        const token = await user.generateAuthToken();
        console.log(token);
        res.cookie('token',token,{
            expires: new Date(Date.now() + 900000),
            httpOnly:true
        });
        
        return res.status(200).json({ message: "Login Succesfull" });
      } else {
        return res.status(500).json({ Error: "Please Enter Correct Creds!" });
      }
    }

    return res.status(422).json({ Error: "User Does not Exist" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ Error: "Enter the Details" });
  }

  try {
    
    const userexist = await User.findOne({ email: email });

    if (userexist) {
      return res.status(422).json({ Error: "User already Exist!" });
    }
    if (password !== cpassword) {
      return res.status(422).json({ Error: "Passwords don't match!" });
    }
    const user = new User({ name, email, password, cpassword });

    const userRegistered = await user.save();

    if (userRegistered) {
      res.status(201).json({ message: "User Registered!" });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
});


router.get('/home',authenticate,async (req,res)=>
{

res.send(req.rootUser);
});




router.post('/addCard',authenticate,async (req,res)=>{
  try {
    
    debugger;
    
    const user = await User.findOne({_id : req.userId});
    const response = req.body
    
    if(user){
      await user.addCard({response,user});

      
    }
    
    res.send({message:"Card Added succesfully"});


  } catch (error) {
    console.log(error);
    res.status(500).json({err:"Something went wrong"});
  }
});


router.get('/getData',authenticate,(req,res)=>
{

res.send(req.rootUser);
});


router.post('/updateCard',authenticate,async(req,res)=>
{
  
  const user = await User.findOne({_id : req.userId});
  const response = req.body
  const cards = user.cards;
  const card = cards.filter(c=>c.id == response.cardId); 
  
  if(user){
 

const result = await User.updateOne({_id : user._id, 'cards.title' : card[0].title},
    // { $set: { "cards.$.laneId" : response.toLaneId } }
    { $set: { "cards.$.laneId" : response.toLaneId }}
  );
console.log(response.toLaneId );
  console.log(result);

    
  }

});


router.post('/deleteCard',authenticate,async(req,res)=>
{
  
  const user = await User.findOne({_id : req.userId});
  const response = req.body
  const cards = user.cards;
  const card = cards.filter(c=>c.id == response.cardId); 
  
  if(user){
 

const result = await User.updateOne({
  "_id": user._id
},
{
  "$pull": {
    "cards": {
      "_id": card[0]._id
    }
  }
});
  console.log(result);

    
  }

});


module.exports = router;
