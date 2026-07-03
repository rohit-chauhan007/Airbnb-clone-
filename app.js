if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
//db
const mongoose = require('mongoose');
const Listing = require("./models/listing");
const methodOverride = require('method-override');

const ejsMate = require('ejs-mate');
//error handling 
const ExpressError = require("./utils/ExpressError");
const { wrap } = require('module');
//validation for schema
//express routes required
const listing =  require("./routes/listing.js");
const reviews = require("./routes/reviews.js") ;
const userRoute = require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;


const flash = require("connect-flash");
// In app.js
// const User = require('./models/user');

// Make sure the file exports properly
//passport
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


 
// const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';
//mongo atlsh db
const atlasdb = process.env.ATLAS_URL;



//databse connectionn
main().then(res=>console.log("database connected")).catch(err=>console.log(err));
async function main(){
  //  console.log("enter");
    // console.log("atlas",atlasdb)
    await mongoose.connect(atlasdb);
    // console.log("mongp",atlasdb)
    // console.log("access");
}
// mongoose.connect(atlasdb)
//   .then(() => console.log('Connected!'));
//middlewares
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.engine("ejs",ejsMate)

//validate function 
//mongo middleware 
let validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errorMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errorMsg);
    }
    else{
      next();
    }
}

//review mongo middleware
let validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errorMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errorMsg);
    }
    else{
      next();
    }
}
//Mongo-session
const store = MongoStore.create({
   mongoUrl:`${atlasdb}`,
   crypto:{
    secret:'mongo-secrete'
   },
   touchAfter:24*3600
});


store.on("error",()=>{
  console.log("Error in mongo-session",err);
})

//express.session
const sessionOption = {
   store:store,
    secret:"mysecret1234",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expire:Date.now()+1*60*60*1000,
      maxAge:1*60*60*1000,
      httpOnly:true
    }
};
app.use(session(sessionOption));
app.use(flash());





//passport strategy middleware and methods
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
});
// app.get("/demouser",async (req,res)=>{
//   let fakeUser = new User({
//     email:"rk9311@gamil.com",
//     username:"Rohit101"
//   })
//   let registerUser = await User.register(fakeUser,"rohit12341");
//    console.log(registerUser);
//    res.send(registerUser);
// });
//routers 
app.use("/listing",listing);
app.use("/listing/:id/review",reviews);
app.use("/",userRoute);


// app.use((err,req,res,next)=>{
//   let {statusCode,message} = err;
//   res.status(statusCode).send(message);
//   console.log(statusCode);
// });

//Error handler middleware
app.use((req,res,next)=>{
   next(new ExpressError(400,"Page not found"));
   
});
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"} = err;
  res.render("./listing/error.ejs",{err});
});

app.listen(port,()=>{
    console.log("server is runninng");
});