const User=require("../models/user");

module.exports.renderSignupform=(req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings"); 
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
  
};

module.exports.renderLoginform=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to back Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "listings";
    if(redirectUrl.includes("/reviews/")){
        // Extract the listing ID from the redirect URL
        const listingId=redirectUrl.split("/reviews/")[0];
        redirectUrl=`${listingId}`;
    }
    res.redirect(redirectUrl);

};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};