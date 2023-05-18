const express = require("express");
const fs = require("fs");
const mongo = require("mongo");
const path = require("path");
const multer = require("multer");   
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const route = express.Router();
const session = require("express-session");
const user = require("../models/userModel");
// const product = require("../models/productModel");
// const review = require("../models/productReviews");
// const nodemailer = require("nodemailer");
// const cart = require("../models/Cart");
// const orders = require("../models/Deliverymodel");
// const query = require("../models/customerQueriesmodel");
// const hbs = require("nodemailer-express-handlebars");
const flash = require("connect-flash");
// const subscribe = require("../models/newsLetter");
// const coupan = require("../models/coupan");
require("dotenv").config();
const MongoStore = require('connect-mongo');
const admin = require("../models/adminModel");
// const address = require("../models/addressModel");
// const category = require("../models/categoryModel");

//multer setup
const storage = multer.diskStorage({
    destination: "static/img",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

//uplaod image to database
const upload = multer({
    storage: storage,
});

//hashed password
async function securedPassword(password) {
    try {
        let passwordHash = await bcrypt.hash(password, 4);
        return passwordHash;
    } catch (err) {
                return res.status(400).render("errorPage");
;
    }
}

//setup middlewares
const app = express();
route.use(cookieparser());
route.use(express.urlencoded({ extended: true }));
route.use(express.static("./static"));
app.set("view engine", `pug`);
app.set(`views`, path.join(__dirname, `views`));
route.use(flash());
mongoose.set("strictQuery", false);


//database connections
const url = process.env.DB;;
mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connection successfull to database");
    })
    .catch((err) =>  res.status(400).send("error occured"));

//session setup
route.use(
    session({
        store: MongoStore.create({ mongoUrl:"mongodb+srv://singhdalpat8182:ravindra@cluster0.toc0ow4.mongodb.net/?retryWrites=true&w=majority"}),
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized: true,
        resave: true,
        cookie: {
            secure: false,
            maxAge: 8*60*60*1000 ,
        },
    })
);


//auth login
const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_sid) {
        } else {
            return res.redirect("/");
        }
        next();
    } catch (err) {
        res.status(400).send(err);
    }
};


//auth logout
const isLogout = async (req, res, next) => {
    {
        try {
            if (req.session.user_sid) {
                return res.redirect("/Home");
            }
            else{}
            next();
        } catch (err) {
                    return res.status(400).render("errorPage");
;
        }
    }
};

//admin login page
const isAdminLogin = async (req, res, next) => {
    try {
        if ( req.session.admin_id) { }
        else {
            return res.redirect("/")

        }
        next();
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
}
//Admin logout
const isAdminLogout = async (req, res, next) => {
    {
        try {
            if (req.session.admin_id) {
                return res.redirect("/Home")
            }
            next();
        }
        catch (err) {
                    return res.status(400).render("errorPage");

        }
    }
}


//Homem page
route.get("/", async (req, res) => {
    try {
           const newMessage = req.flash("login");
            const newAlert = req.flash("alert");
            return res.render("index",{ message: newMessage, alert: newAlert });
        
    } catch (err) {
                return res.status(400).render("errorPage");
;
    }
});

//Dashboard
route.get("/Home", isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const userDetails = await user.findOne({ _id: data });
        res.render("posterDes" ,{
            userData: userDetails,
        });
    } catch (err) {
        return res.status(400).render("errorPage");
    }
});

//login data
route.post("/checkLogin", async (req, res) => {
    try {
        const userEmail = req.body.email;
        let userPassword = req.body.password;

        const isEmail = await user.findOne({ email: userEmail });
        const isPasswordMatch = await bcrypt.compare(req.body.password, isEmail.password);
        if (!isEmail) {
            req.flash("login", "user not registered");
            req.flash("alert", "rose");
            return res.redirect("index")

        } else {
            if (isPasswordMatch) {
                req.session.user_sid = isEmail._id;

                res.cookie("email", isEmail._id, { expire: 1000 * 60 * 60 * 24 });

                return res.redirect("/Home");
            } else {
                req.flash("/");
                req.flash("alert", "rose");
                req.flash("login", "Invalid email or password");
                return res.redirect('/')

            }
        }
    } catch (err) {
        // console.log(err)
        return res.status(400).render("errorPage");

    }
});

route.get("/error", (req, res) => {
    return   res.render("errorPage");
});

//forgot password page
route.get("/forgotPassword", isLogout,(req, res) => {
    try {
        return res.render("updatePassword", { title: "Forgot password page" });
    } catch (err) {
        return res.status(400).render("errorPage");
;
    }
});

//password updated
route.post("/passwordChange", async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const newHashedPassword = await securedPassword(userPassword);

        const newPassword = await user.updateOne(
            { email: userEmail },
            {
                $set: {
                    password: newHashedPassword,
                },
            }
        ).then(() => {

            return  res.render("index", {
                alert: "green",
                message: "password Updated",
            })
        });
    } catch (error) {
        return res.status(400).render("errorPage");

    }
});

//contact page
route.get("/contact", isLogin,async (req, res) => {
    try {
        const data = req.cookies.email;
        const userDetails = await user.findOne({ _id: data });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);
        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const messageSent = req.flash("querySent");
        return res.render("contact", {
            userData: userDetails,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            message: messageSent,
            title: "Contact page",

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//register page
route.get("/register", isLogout, (req, res) => {
    try {
       
       return res.render("registration");
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//new User registration route
route.post("/newUserRegistration",upload.single("userImage"),async (req, res) => {
        try {
            const passwordByUser = req.body.password;
            new_Hased_Password = await securedPassword(passwordByUser);
            const email_already_registerd = await user.findOne({
                email: req.body.email,
            });
            if (email_already_registerd) {
                return res.render("registration", {
                    alert: "rose",
                    message: "User already registered.Please Login.",
                });
            } else {
                const newUser = new user({
                    fullname: req.body.name,
                    email: req.body.email,
                    number: req.body.number,
                    
                    password: new_Hased_Password,
                    photo: req.file.filename,
                });
                const user_registered = await newUser.save().then(() => {
                  
                    req.flash("alert", "green");
                    req.flash("login", "new user registered");
                    return res.redirect("/");
                });
            }
        } catch (err) {
            return res.status(400).render("errorPage");

        }
    }
);




//userProfile page
route.get("/userProfile", isLogin, async (req, res) => {
    try {
        const data = req.cookies.email;
        const userDetails = await user.findOne({ _id: data });
      
        return res.render("userProfile", {
            userData: userDetails,

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//update USER profile
route.get("/updatdeUserProfile/:id",isLogin, async (req, res) => {
    try {
        const data = req.params.id;
        const userDetails = await user.findById({ _id: data });
        const new_categories = await category.aggregate([
            { $match: { status: "active" } },
        ]);

        const cartdata = await cart.find({ user_id: data });
        var numberOfProductsInCart = 0;
        cartdata.forEach((e) => {
            newCartData = e.products;
            numberOfProductsInCart = e.products.length;
        });
        const newProfileMessage = req.flash("userMessage");

        return    res.render("updateUserProfile", {
            userData: userDetails,
            category: new_categories,
            productsInCart: numberOfProductsInCart,
            title: "Update user profile page",
            message: newProfileMessage,

        });
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//updating user data
route.post(
    "/updatedUserProfile",isLogin,
    upload.single("userImage"),
    async (req, res) => {
        let new_image = "";
        let userId = req.body.userID;
        try {
            
            const updatedData = await user
                .updateMany(
                    { _id: userId },
                    {
                        $set: {
                            fullname: req.body.name,
                            number: req.body.number,
                            addressLine1: req.body.addressline1,
                            addressLine2: req.body.addressLine2,
                            city: req.body.city,
                            state: req.body.state,
                            country: req.body.country,
                            zipcode: req.body.zipcode,
                            photo: req.file.filename,
                        },
                    }
                )
                .then(() => {
                    return res.redirect("/userProfile");
                });
        } catch (err) {
            return res.status(400).render("errorPage");

        }
    }
);

//change user password
route.post("/changeUserPassword/:id", async (req, res) => {
    try {

        const userID = req.params.id;
        const confirmUserPassword = req.body.confirmPassword;
        const userPasswordHasshed = await securedPassword(confirmUserPassword)
        const updatePasswordOfUser = await user.findByIdAndUpdate({ _id: userID }, {
            $set: {
                password: userPasswordHasshed,
            }
        }).then(() => {
            req.flash("userMessage", "Password has been changed successfully.")
            return  res.redirect("/userProfile")
        })

    } catch (err) {
        return res.status(400).render("errorPage");

    }
});

//logout
route.get("/logout", isLogin, async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("email");
        res.clearCookie("id");
        res.redirect("/");
    } catch (err) {
        return res.status(400).render("errorPage");

    }
});





//********************************************admin  pages************ */
//admin Login page
route.get("/admin/AdminLogin", (req, res) => {
    if (req.session.admin_id) {

        return res.redirect("/admin/adminHome");
    } else {

        return res.render(`adminLogin`)
    }
});
//adminlogincheck
route.post("/admin/adminLoginCheck" , async(req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminEmail = await admin.findOne({email:email});
        const adminPasswordMatch =  await bcrypt.compare(password, adminEmail.password)
 
                if(adminPasswordMatch){
                     req.session.admin_id = email
                     res.cookie("id", adminEmail._id, { expire: 1000 * 60 * 60 * 24 });
                     
                     return res.redirect('/admin/adminHome')
                    
                }
                else
                {
                    return res.render("adminLogin",{
                        type:"red",
                        err:"Invalid email or password"
                    })
                }

   
    }
    
      
    
    catch (err) {
                return res.status(400).render("errorPage");
;
    }
});


//new adminRegistration
route.get("admin/newAdminRegistration", isAdminLogin ,async(req,res)=>{
    try{
    const admin_data= await admin.findOne({_id:req.cookies.id});

    return  res.render("adminRegistration",{adminDetails:admin_data})
    }
    catch(err){
        return res.status(400).render("errorPage");

    }
});

//new admin registration
route.post("/admin/addNewAdmin",isAdminLogin,upload.single("adminImage"),async(req,res)=>{
    const adminPassword = req.body.password;
    const newHashedPasswordForAdmin = await securedPassword(adminPassword)
    try{

        const newadmin = new admin({
            name:req.body.name,
            email:req.body.email,
            number:req.body.number,
            company:req.body.Company,
            role:"admin",
            password:newHashedPasswordForAdmin,
            image:req.file.filename
        })

        const newAdminRegistered = await newadmin.save().then(()=>{
            
            return    res.redirect("/admin/adminProfile")
           
        })

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});

//update admin password
route.post("/admin/updateAdminPassword",isAdminLogin,async(req,res)=>{
    try{
        const adminEmail = req.body.passswordEmail;
        const  adminPassword = req.body.Cpassword;
        const new_admin_updated_hassed_password = await securedPassword(adminPassword);
        const adminPasswordUpdteId = req.cookies.id;
        const adminUpdatePassword = await admin.findByIdAndUpdate({_id:adminPasswordUpdteId},{
            $set:{
                password:new_admin_updated_hassed_password,
            }
        }).then(()=>{
            return     res.redirect("/admin/admin/adminProfile")
        })
        

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});

//admin home page
route.get("/admin/adminHome", isAdminLogin, async (req, res) => {
    try {
        const mydata = await user.find({});
        const customerCount = await user.count({});

       
        const admin_data= await admin.findOne({_id:req.cookies.id});
      
        

        return   res.render("adminHome", { x: mydata,adminDetails:admin_data,customerNumber: customerCount,});
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }

});

//admin profile
route.get("/admin/adminProfile",isAdminLogin,async(req,res)=>{
    try{
        const admin_profile  = await admin.findOne({_id:req.cookies.id});

        return   res.render("adminProfile",{
            admin:admin_profile,

        })

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});


//update admin profile
route.post("/admin/update_admin_profile",isAdminLogin,upload.single("admin_image"),async(req,res)=>{
    try{
        const adminId = req.cookies.id;
        admin_new_image = "";
        const admin_profile  = await admin.findOne({_id:req.cookies.id});

       
        const updatedAdmin = await  admin.findByIdAndUpdate({_id:adminId},{
            $set:{
                name:req.body.name,
                email:req.body.email,
                number:req.body.number,
                company:req.body.company,
                image:req.file.filename
            }
        }).then(()=>{
          

            return    res.render("adminProfile",{
                updateSuccess:"Admin succesfully updated"
            })
        })

    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
})



//all customers/ user routes 
route.get("/admin/users",isAdminLogin, async (req, res) => {
    try {
        const mydata = await user.find({});
        const admin_data= await admin.findOne({_id:req.cookies.id});
        let allUsers = req.flash("user")
        return   res.render("users", { x: mydata,
            adminDetails:admin_data,message:allUsers })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
})



//Add new user in admin dashboard
route.post('/admin/addNewUser',isAdminLogin, upload.single("image"), async (req, res) => {
    const fullname = req.body.name;
    const email = req.body.email;
    const number = Number(req.body.number);
    let cpassword = req.body.cpassword;
     const photo = req.file.filename;

    let newPassword = await securedPassword(cpassword)
    const existEmail = await user.findOne({email:req.body.email});
    try {
        if (existEmail) {
            
            
            req.flash("user", "User already registered")
            return   res.redirect("/admin/adminHome")
            
        }
        else {
            
                        const newUser = new user({
                            fullname: fullname,
                            email: email,
                            number: number,
                            password: newPassword,
                            status:req.body.radio,
                            photo: photo
                        });
            
                        const added = await newUser.save().then(() => {
                            
                              req.flash("user" , "New user added succesfully." )
                              return   res.redirect('/admin/adminHome');
                        })
        }
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }

});



//EditUser page in admin dashboard
route.get("/admin/editUser/:id",isAdminLogin, async (req, res) => {
    try {
        editUserId = req.params.id;
        const allData = await user.findOne({ _id: editUserId });
        const admin_data= await admin.findOne({_id:req.cookies.id});
        return   res.render("editUser", { UserDetails: allData, adminDetails:admin_data })
    }
    catch (err) {
                return res.status(400).render("errorPage");

    }
});

//user updated
route.post("/admin/updateUser",isAdminLogin, upload.single("image"), async (req, res) => {


    const id = req.body.userid;
     const fullname = req.body.name;
     const email = req.body.email;
     const number = req.body.number;


    
 
     try {
        
         let updatedData = async (id) => {
             await user.findOneAndUpdate({ _id: id },
                 {
                     $set: {
                         fullname: fullname,
                         email: email,
                         number: number,
                         photo:req.file.filename,
                     }
                 }).then(() => {
                     
                       req.flash("user","User Updated successfully")
                       return  res.redirect("/admin/adminHome")
                 })
         }
         updatedData(id);
     }
     catch (error) {
        return res.status(400).send(error);
        // console.log(error)

     }
 
 
 
 });


 //delete user from admin dashboard
route.get("/admin/dltUser/:id",isAdminLogin, async (req, res) => {
    dltid = req.params.id;

    try {
        
        await user.findByIdAndDelete({ _id: dltid }).then(() => {
            req.flash("user","User removed successfully")

            return res.redirect("/admin/adminHome");
        })
    }


    catch (err) {
                return res.status(400).render("errorPage");

    }
});



//change the users password  in admin dashboard
route.post("/admin/changeUserPassword",isAdminLogin,async(req,res)=>{
    try{
        const changePasswordOfUser =  req.body.UserID;
        const cnfrmPassword = req.body.confirmPassword;
        const new_password_of_user = securedPassword(cnfrmPassword);
        const newUpdatedPassword = await user.findByIdAndUpdate({_id:changePasswordOfUser},{
            $set:{
                password:new_password_of_user,
            }
        }).then(()=>{
            req.flash("user","Password updated successfully")
            return  res.redirect("/admin/adminHome")
        })
    }
    catch(err)
    {
                return res.status(400).render("errorPage");

    }
});


//admin logout route
route.get("/adminLogout", isAdminLogin, (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("product_id");
        res.clearCookie("connection.sid");
        res.clearCookie("user_sid");
       
        res.clearCookie("id")
        res.redirect("/admin/adminLogin")
    }
    catch (err) {
        return res.status(400).render("errorPage");

    }
})





module.exports = route;
