const Review=require("../models/reviews.js");
const Listing=require('../models/listing.js');


module.exports.createReview=async(req,res)=>{
    // console.log(req.params.id);
    let listing =await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);;
    // console.log("user",req.user);
    newReview.author=req.user._id;   //day-51 v-9
    // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    // console.log("newReview saved");
    // res.send("newReview saved");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};





