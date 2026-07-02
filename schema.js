const joi = require('joi');
const Listing = require('./models/listing');
const Joi = require('joi');
const review = require('./models/review');

 module.exports.listingSchema = joi.object({
    listing: joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image: Joi.object({
         filename: Joi.string().allow("", null),
         url: Joi.string().allow("", null)
        }).optional(),
        price:joi.number().min(1).required(),
        location:joi.string().required(),
        country:joi.string().required()
      
    }).required(),
})

module.exports.reviewSchema = Joi.object({
   review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required()
   })
}).required();