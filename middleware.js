    const Listing=require("./models/listing.js");
    const {ListingSchema,reviewSchema}=require('./schema.js');
    const ExpressError=require('./utils/ExpressError.js');
    const Review=require("./models/reviews.js");

    module.exports.isLoggedIn=(req,res,next)=>{
        // console.log(req.user);
        // console.log(req.path,req.originalUrl);
        if(!req.isAuthenticated()){
            //redirect original URL
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must be logged in to create listing");
            return res.redirect("/login");
        }
        next(); //if user is authenticated then next middleware will be called.
    }
     

    module.exports.savedRedirectUrl=(req,res,next)=>{
        if(req.session.redirectUrl){
            res.locals.redirectUrl=req.session.redirectUrl;
            delete req.session.redirectUrl;
        }
        next();
    }


    module.exports.isOwner=async (req,res,next)=>{
        let {id}=req.params;
        let listing=await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currentUser._id)){
            req.flash("error","You are not the owner of listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }

    module.exports.ValidateListing=(req,res,next)=>{
        let result=ListingSchema.validate(req.body);
        // console.log(result);
        if(result.error){
            let errMsg=result.error.details.map((el)=>el.message).join(",");   //full details of error
            throw new ExpressError(400,errMsg);
            // throw new ExpressError(400,result.error);
        }else{
            next();
        }


    }


    //day-47,validation reviews
    module.exports.ValidateReview=(req,res,next)=>{
        let {error}=reviewSchema.validate(req.body);
        // console.log(result);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");   //full details of error
            throw new ExpressError(400,errMsg);
            // throw new ExpressError(400,result.error);
        }else{
            next();
        }
    }


    module.exports.isReviewAuthor=async(req,res,next)=>{
        let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review.author._id.equals(res.locals.currentUser._id)){
            req.flash("error","You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }  

