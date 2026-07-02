const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createReviews = async(req,res)=>{
   const listing = await Listing.findById(req.params.id);
   const newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   console.log(newReview);
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   res.redirect(`/listing/${listing.id}`);
};
module.exports.deleteReviews = async(req,res)=>{
  const {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listing/${id}`);
};
