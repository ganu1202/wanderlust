const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const passportLocalMongoose=require('passport-local-mongoose');



const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },

})
//here we did not define username and password becz passport-local-mongoose will automatically add fields for username and hashed password and salt value by default.

userSchema.plugin(passportLocalMongoose);//adds username and password

module.exports=mongoose.model("User",userSchema);