const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});


module.exports.index=async (req,res)=>{
    // await Listing.find({}).then((res)=>{
    // console.log(res);
    const allListings=await Listing.find({});
    // console.log(allListings);
    res.render('listings/index.ejs',{allListings});
};


module.exports.renderform=(req,res)=>{
    // console.log(req.user);
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create listing");
    //     return res.redirect("/login");
    // }
  
    res.render('listings/new.ejs');
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate(
        {   path:"reviews",
            populate:{
            path:"author"
            }
        }).populate("owner")
        
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render('listings/show.ejs',{listing});

};

module.exports.createListing=async(req,res,next)=>{

    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send()

    // console.log(response.body.features[0].geometry);
    // res.send("done");

    // let {title,description,image,price,county,location}=req.body; another way for this is to make these all names as keys of listing object.
    // let listing=req.body.listing;   //another way of above line,return a JS OBJECT and to convert this JS obj to document u can use -> new Listing(listing)
    // // console.log(listing);
    // new Listing(listing);
        //above 3 lines in 1 line.  converting JS Object returned into document.


    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
          

    // if(!newListing.title){
    //     throw new ExpressError(400,"title is missing");

    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"description is missing");

    // }
    // if(!newListing.location){
    //     throw new ExpressError(400,"location is missing");

    // }
    const newListing=new Listing(req.body.listing);
    // console.log(req.user);
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"..",filename);
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    newListing.owner=req.user._id;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created");
    res.redirect('/listings');


};

module.exports.renderEditform=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you request for doesn't exist");
        res.redirect("/listings");
    }
    let originalUrl=listing.image.url;
    // console.log(originalUrl);
    URL=originalUrl.replace("/upload","/upload/w_250");
    // console.log(URL);
    res.render('listings/edit.ejs',{listing,URL});
};


module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    // let listing=req.body.listing;
    // if(! req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    // let listing=await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currentUser._id)){
    //     req.flash("error","You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});          //deconstructing returned JS object.
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    // res.send(req.file);
    // console.log("File",req.file);
    // await listing.save();
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);    //redirecting to show page

};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deltedListing=await Listing.findByIdAndDelete(id);
    // console.log(deltedListing);
    req.flash("success","Listing Deleted");
    res.redirect('/listings');

};

