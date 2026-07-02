const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
         url:{
            type:String,
            default:
      "https://images.unsplash.com/photo-1779044991881-b1d0763fefe4?q=80&w=1229&auto=format&fit=crop",

      set: (v) =>
         v === ""
         ? "https://images.unsplash.com/photo-1779044991881-b1d0763fefe4?q=80&w=1229&auto=format&fit=crop"
         : v,
          },
          filename:{
           type:String,
         },
    },
    price:{
        type:Number,
        required:true
      
    },
    location:{
        type:String
    },
    country:{
        type:String,
        required:true
   
    },
    reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review",
    }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
     
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
})

//mongoose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    
    if(listing){
     await Review.deleteMany({_id:{$in:listing.reviews}});
    }else{
        console.log("not delete");
    }
   
})

const Listing = mongoose.model("Listing",listingSchema);
 module.exports = Listing;


