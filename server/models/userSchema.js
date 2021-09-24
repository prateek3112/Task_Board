const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config({ path: "./config.env" });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  cards :[
   { 
     id : {
       type : String
     },
    title : {
      type: String
    },
    
    description : {
      type : String
    },
    laneId : {
      type : Number
    },
    createdAt:{
      type:String
    },
    createdBy:{
      type:String
    }
    
  }
  ]

});

//hashing

userSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is new)
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);

    next();
  }
});

//generating Auth Token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET);
    this.tokens = this.tokens.concat({ token: token });
   await this.save();
   return token;
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.addCard = async function (res){
  try {
    
  

  this.cards = this.cards.concat({id : res.response.card.id, title : res.response.card.title, description : res.response.card.description, createdBy : res.user.name , laneId: res.response.laneId, createdAt : new Date().toLocaleString()});
  console.log(res.response);
  await this.save();
  
  } catch (error) {
    console.log(error);
  }
}



// userSchema.methods.updateCard = async function (res){
//   try {
//     debugger;
  
    
//   //  this.cards;
//   //  this.cards.forEach(element => {
//   //   console.log(element.id);
    
//   //  });
//   const card = this.cards.filter(c=>c.id == res.response.cardId); 
//   console.log(card);
  
// const filter = {_id : card._id}
//   this.cards.findOneAndUpdate(filter,{laneId : res.response.landeId})
//    console.log(res.response.cardId)
   

//   // console.log(res.response);
//   // await this.save();
  
//   } catch (error) {
//     console.log(error);
//   }
// }

const User = mongoose.model("USER", userSchema);

module.exports = User;
