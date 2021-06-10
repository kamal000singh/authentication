const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/userDB",
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
 const userSchema = new mongoose.Schema({
   user:String,
   password:String
 });
 const secrets = "This is encrypted";
 userSchema.plugin(encrypt,{secret:secrets,encryptedFields:["password"]})
 const User = new mongoose.model("User",userSchema);
app.route("/")
.get(function(req,res){
  res.render("home");
})
.post();
app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const user = req.body.username;
  const pwd = req.body.password;
  const newuser = new User({
    user:user,
    password:pwd
  })
  newuser.save(function(err){
    if(!err){
      res.render("secrets")
    }else{
      console.log(err);
    }
  });
});
app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const user = req.body.username;
  const pwd = req.body.password;
  User.findOne({user:user},function(err,result){
  if(result){
    if(result.password === pwd){
    res.render("secrets");
  }else {
    res.render("login");
  }
}else {
  console.log(err);
}
  })

});
// app.route("/secrets").get(function(req,res){
//   res.render("secrets");
// }).post();
app.route("/submit").get(function(req,res){
  res.render("submit");
}).post();
app.listen(3000,function(req,res){
  console.log("Start Server for PORT : 3000 ");
})
