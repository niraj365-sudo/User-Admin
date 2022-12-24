const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

const Admin = require('../models/Admin');
const { route } = require('.');


//passport config
require('../config/passport');

//Route for login
router.get('/login',(req,res)=>{
    res.render('admin_login')
})
//Route for register
router.get('/register',(req,res)=>{
    res.render('admin_register')
})

//Register handle
router.post('/register',async(req,res)=>{
    const {name, email, password, password2}= req.body
    Admin.findOne({
        email: email
    }).exec(async(err,admin)=>{
        if(err){
            res.send('Error!!',err)
        }
        if(admin){
           // req.flash('error_msg','Email already registered');
           res.send('User already registered.')
            return res.redirect('/admin/register')
        }
        
        
        console.log(req.body);
        let errors = []
        
        //Check require fields
        
        if (!name || !email || !password || !password2) {
            errors.push({msg: "Please fill in all fields."})
    }
    
    //Check password match
    if (password != password2) {
        errors.push({msg: "Password doesnot match."})
    }
    
    //Check password length
    if (password.length <6) {
        errors.push({msg: "Password should be atleast of 6 characters."})
    }

    if (errors.length > 0) {
        return res.render('user_register',{
            errors,
            name,
            email,
            password,
            password2

        })
        
    } else {

        try {
            const hash_password = await bcrypt.hash(password, 10)
            const admin =  new Admin({
                name: name,
                email: email,
                password: hash_password
            })
            admin.save((err,data)=>{
                if(err){
                    throw err;
                }
                console.log(data);
                
            })
            req.flash('success_msg','You are now registered');
            return res.redirect('/admin/login')
            
        } catch (error) {
            
            console.log(error);
        }
    }
})
    
})

//Login Handle
router.post('/login',(req, res, next)=>{
    passport.authenticate('local',{
        successRedirect: '/admin_dashboard',
        failureReidrect: '/admin/login',
        failureFlash: true
    })(req, res, next);
    console.log("admin loged in.");

})

//Logout Handle
router.get('/logout',(req, res)=>{
    req.logout((err)=>{
        if(err){
            throw err

        }
        req.flash('success_msg','You are logged out')
        res.redirect('/admin/login')
        
    });
})


module.exports = router;