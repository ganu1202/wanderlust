const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const Review=require("../models/reviews.js");
const Listing=require('../models/listing.js');
const {ValidateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js");


//d-47 reviews ,post route
router.post("/",isLoggedIn,ValidateReview,wrapAsync(reviewController.createReview));

//d-47 delete reviews route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
