const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require('../models/listing.js');
const {isLoggedIn,isOwner,ValidateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});



//Index Route, Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    ValidateListing,
    wrapAsync(listingController.createListing)
);
// .post(upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// })

//New route
router.get('/new',isLoggedIn,listingController.renderform);

//show,delete,update routes
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn, 
    isOwner,
    upload.single("listing[image]"),
    ValidateListing, 
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));




//Edit route
router.get('/:id/edit',
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditform)
);

module.exports=router;

