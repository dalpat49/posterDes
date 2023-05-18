const express = require("express");

const mongo = require("mongo");
const multer = require("multer");
const cookieparser = require("cookie-parser");
const  mongoose = require("mongoose")
// const bcrypt = require("bcrypt");
const route = require("./routes/index")
require('dotenv').config()

const app = express();
app.use(cookieparser());

const port =  process.env.PORT || 10000 ;



app.set(express.urlencoded({ extended: true }));
app.use(express.static("./static"));
app.set("view engine", `pug`);
app.use(function(req, res, next) { 
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0 application/javascript');
     next();
     
   });


//route
app.use('/',route);


//server
app.listen(port, () => {
    console.log(`server has  been started at ${port}`)
})

