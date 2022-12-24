const express = require('express')
const router =  express.Router()
const {
    ensureAuthenticated_user,
    ensureAuthenticated_admin
} = require('../config/auth');

//Welcome Page
router.get('/', (req, res)=> res.render("welcome"))

//Dashboard Page

//For User
router.get("/user_dashboard",ensureAuthenticated_user, (req,res)=>
  res.render("user_dashboard",
  // {
  //   name: req.user.name
  // }
  ))

//For Admin
router.get("/admin_dashboard",ensureAuthenticated_admin, (req,res)=>
  res.render("admin_dashboard" 
  // ,{
  //   name: req.admin.name
  // }
  ))

module.exports = router