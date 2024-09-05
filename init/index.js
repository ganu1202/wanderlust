const initData=require("./data.js");

const Listing=require('../models/listing.js');

const mongoose=require('mongoose');

const URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log('Connection successful');
}).catch((error)=>{
    console.log(error);
})

async function main(){
    await mongoose.connect(URL);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'6637dcf5c1db1fb4954ec0c3'}))
    await Listing.insertMany(initData.data);        //as initData is object we are accessing its key data and storing it (see data.js last line)
    console.log('Data was initalized');

}

initDB();

