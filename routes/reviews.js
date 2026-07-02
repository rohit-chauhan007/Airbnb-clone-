const express = require('express');
const router = express.Router({mergeParams:true});
const {listingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const  Review = require("../models/review.js");
const Listing = require("../models/listing");
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require("../controller/review.js")

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

//review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReviews));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReviews));

module.exports = router;
