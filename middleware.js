const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
   if(!req.isAuthenticated()){
       req.session.redirectUrl = req.originalUrl;
       return res.redirect('/login')
   }
next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log( res.locals.redirectUrl);
    }
    next()

}

module.exports.isOwner =async (req,res,next) =>{
    const {id} = req.params;
    const listing =await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner");
        return res.redirect(`/listing/${id}`);
    }
     next();
};

module.exports.isReviewAuthor = async (req,res,next) =>{
    const {id,reviewId} = req.params;
    const review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner");
        return res.redirect(`/listing/${id}`);
    }
     next();
};




// module.exports.isReviewAuthor = async (req,res,next)=>{
//     console.log("trigger");
//     const {id,reviewId} = req.params;
//     const review  = await Review.findById(reviewId);
//     if(!review.author.equals(res.locals.currUser._id)){
//         flash("error","You are not the author");
//         return res.redirect(`/listing/${id}`);
//     }
//     next()
// }



