const mongoose = require('mongoose');
const Listing = require("../models/listing");
const User = require('../models/user');
const initData = require("./data");


const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';

//databse connectionn
main().then(res=>console.log("database connected")).catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
     await Listing.deleteMany({});
     initData.data = initData.data.map((obj)=>({
       ...obj,owner:'6a2fed4fe705ea97443d9e7e',
     }));
     await Listing.insertMany(initData.data);
     console.log("success");
      
}
initDB();


