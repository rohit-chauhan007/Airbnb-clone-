const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/users.js");

router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.renderLoginForm);

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local",
  {failureRedirect:"/login",failureFlash:true}),
  (req,res)=>{
   const redirectUrl = res.locals.redirectUrl ?? "/listing";
    res.redirect(redirectUrl);
   
  });

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","You are logout");
      res.redirect('/listing');
    })
})
module.exports = router;