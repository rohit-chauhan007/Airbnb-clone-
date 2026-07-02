const User = require("../models/user");
module.exports.renderSignupForm = (req,res)=>{
  res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res,next)=>{
  try{
    let {username,email,password} = req.body;
     const userDetail = {username,email,password};
    const newUser = new User({email,username});
    const registerUser = await User.register(newUser,password);
    req.login(registerUser,(err)=>{
      if(err){
        return next(err);
      }
       req.flash("success","Successful signup");
       res.redirect("/listing");
    })
  }catch(er){
     console.log(er.message);
     req.flash("error",er.message);
     res.redirect("/signup");
  }
};


module.exports.renderLoginForm = (req,res)=>{
  res.render("./users/login.ejs")
}