const express = require('express');
const router = express.Router();
const {listingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,isReviewAuthor } = require('../middleware.js');
const listingController = require("../controller/listings.js");

//multer
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

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
};

//router.route
//create route
 router
 .route("/")
 .get(wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single("listing[image][url]"),wrapAsync(listingController.creatListing));
 //show detaile route
 router.get("/new",isLoggedIn,listingController.renderCreateForm);

//delete route
//update route
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image][url]"), wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));


module.exports = router;