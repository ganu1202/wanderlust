require('dotenv').config();
const express=require('express');           //require express
const app=express()
const port=8080;
const  mongoose=require("mongoose");        //require mongoose
const engine=require('ejs-mate');
app.engine('ejs',engine);
app.set('view engine','ejs');
const path=require('path');

const ExpressError=require('./utils/ExpressError.js');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const listingsRouter=require("./Routes/listing.js");
const reviewRouter=require("./Routes/review.js");
// const URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;
const methodOverride=require('method-override');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/user.js");
const userRouter=require("./Routes/user.js");

// to serve static files
app.use(express.static(path.join(__dirname,'/public')));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
})

main().then(()=>{
    console.log('Connection successful');
}).catch((error)=>{
    console.log(error);
})

async function main(){
    // await mongoose.connect(DB);
    await mongoose.connect(dbUrl);

}


//day49 v-8

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,
})


store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,//security purpose
    }
}


// app.get("/",(req,res)=>{
//     res.send('Hi Iam root');
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));//all users will be authhenticated using local strategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());//for storing users to session so that no need to login again.
passport.deserializeUser(User.deserializeUser());//for un-storing users from session.

app.get("/demouser",async(req,res)=>{
    let fackeUser=new User({
        email:"student@gmail.com",
        username:"delta-student",

    })

    let registeredUser=await User.register(fackeUser,"helloworld");
    res.send(registeredUser);
})

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");    
    res.locals.error=req.flash("error"); 
    res.locals.currentUser=   req.user;
    console.log(res.locals.success);    //success is an array
    next();
})


// day48- Restructuring listings.
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);





app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));       //When users sends a request to route to which request is not handled or route handler is defined.
});


//d-45, v-3
app.use((err,req,res,next)=>{
    // res.send('something went wrong');
    let {status=500,message="Something Went Wrong"}=err;
    // res.status(status).send(message);       //res.status(statusCOde)-> setting setatus custom status code
    res.status(status).render("error.ejs",{message});
});
// This middleware will be executed whenever an error is passed to the next() function. 



