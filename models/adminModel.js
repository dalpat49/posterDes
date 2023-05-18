const mongoose = require("mongoose");

const newAdmin = new mongoose.Schema({
        name:String,
        email:String,
        number:Number,
        company:String,
        role:String,
        password:String,
        image:String

})




const admin = mongoose.model("admin", newAdmin);

module.exports =  admin;