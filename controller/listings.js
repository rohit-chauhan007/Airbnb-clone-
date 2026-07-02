const Listing = require("../models/listing");
const geoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = geoCoding({ accessToken: mapToken });
const Swal = require('sweetalert2')


module.exports.index = async (req,res)=>{
 
  const listings = await Listing.find();
  res.render("./listing/index.ejs",{listings})
};

module.exports.newListing = (req,res)=>{
  res.render("./listing/new.ejs");
};
module.exports.renderCreateForm = (req,res)=>{
  res.render("./listing/new.ejs");
};
module.exports.creatListing = async(req,res,next)=>{
    const response = await geocodingClient
    .forwardGeocode({
          query:req.body.listing.location,
          limit: 1
        })
       .send();
        //  console.log("geometry",response.body.features[0].geometry);
         const listing = new Listing(req.body.listing);
         listing.owner = req.user._id;

      if(typeof req.file != "undefined"){
        
         const url = req.file.path;
         const filename = req.file.filename;
         listing.image = {url,filename};
      }
         listing.geometry = response.body.features[0].geometry;
        
         const saveListing =  await listing.save();
        //  console.log(saveListing);
         req.flash("success","Listing added succefull");
         res.redirect("/listing",);
};
module.exports.showListing = async(req,res)=>{
       const {id} = req.params;
       const listing = await Listing.findById(id).
        populate({path:"reviews",
        populate:{path:"author"}}).
        populate("owner");
     if(!listing){
       req.flash("error","Listing does not found !");
       res.redirect("/listing");
     }else{
      res.render("./listing/show.ejs",{listing});  
     }
};
module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs",{listing});
};
module.exports.updateListing = async(req,res)=>{
      const {id} = req.params;
      const updatedListing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true},{ runValidators: true });
       if(typeof req.file != "undefined"){
         const url = req.file.path;
         const filename = req.file.filename;
         updatedListing.image = {url,filename};
         updatedListing.save(); 
       }
      res.redirect(`/listing/${id}`);
};
module.exports.deleteListing = async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Succefull");
    res.redirect("/listing");
};