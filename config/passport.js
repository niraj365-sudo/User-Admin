const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Admin = require('../models/Admin');
const User = require('../models/User');

// passport.use('admin', new LocalStrategy({
//     usernameField: 'email'
// },
//     (email, password, done) => {
//         //match user
//         Admin.findOne({ email: email })
//             .then(patient => {
//                 if (!patient) {
//                     return done(null, false, { message: 'That email is not registered' });
//                 }

//                 //match password
//                 bcrypt.compare(password, patient.password, (err, isMatch) => {
//                     if (err) throw err;

//                     if (isMatch) {
//                         return done(null, patient);
//                     } else {
//                         return done(null, false, { message: 'Password Incorrect' });
//                     }
//                 });
//             })
//             .catch(err => console.log(err));
//     })
// );



// passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(function(id, done) {
//     if (user) {
//         User.findById(id, function(err, user) {
//             if (err) done(err);
//             done(null, user);
//           });
      
      
//     } else {
//         Admin.findById(id, function (err, admin) {
//             if (err) done(err);
//             done(null, admin);
//         })
//     }
//    })

   
module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ usernameField: 'email', passwordField:"password" }, (email, password, done) => {
        // Match user
        User.findOne({
          email: email
        }).then(user => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered' });
          }
  
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        });
      })
    );
      
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
          // Match user
          Admin.findOne({
            email: email
          }).then(admin => {
            if (!admin) {
              return done(null, false, { message: 'That email is not registered' });
            }
    
            // Match password
            bcrypt.compare(password, admin.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, admin);
              } else {
                return done(null, false, { message: 'Password incorrect' });
              }
            });
          });
        })
      );

      // passport.serializeUser(function(user, done) {
      //   done(null, user.id);
      // });
    
      // passport.deserializeUser(function(id, done) {
      //       User.findById(id, function(err, user) {
      //           if (err) {
      //             done(err)
      //           }
      //           if (user) {
      //             done(null, user);
      //           }else{
      //             Admin.findById(id, function (err, admin) {
      //               if (err) done(err);
      //               done(null, admin);
      //             })
      //           }
                
      //         });
          
          
      // })

      passport.serializeUser((admin , done)=>{
          done(null, admin.id)
      })

      passport.deserializeUser((id, done)=>{
        Admin.findById(id, (err, admin)=>{
          if (err) {
            done(err)
          } else {
            if (admin) {
                done(null, admin)
            } else {
              User.findById(id, (err, user)=>{
                if(err) done(err);
                done(null, user);
              })
            }
          }
        })
      })

}