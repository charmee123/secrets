//jshint esversion:6
require('dotenv').config(); //always put it on top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser: true});

// const userSchema = {
//   email: String,
//   password: String
// };

//level 2 of authentication
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password']  });
///////level 2 completed/////////////

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save().then(function(){
    res.render("secrets");
  })
  .catch(function(err){
    console.log(err);
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne(
    {email: username}
  ).then(function(foundUser){
    if (foundUser){
      if(foundUser.password === password){
        res.render("secrets")
      }
    }
  }).catch(function(err){
    console.log(err);
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//git ignore is used to ignore some files like hidden files
//ignore node_modules, .env
