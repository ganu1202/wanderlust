const Joi = require('joi');
const joi=require('joi');

module.exports.ListingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),   //title is of type string and it should be filled
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),       //price should not be -ve so min(0)
        image:joi.string().allow("",null)   //image is of tyoe string and it can filled as empty strng and null values becz we have default for img
    }).required() //this line means whenever req comes it should contain listing object

});


module.exports.reviewSchema=joi.object({
    review: joi.object({                //review is object which should contain another object , with rating and comments as fields to be filled.
        rating:joi.number().required().min(1).max(5) , 
        comment:joi.string().required()
    }).required()
})

