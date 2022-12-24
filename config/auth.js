module.exports = {

    //For User
  
    ensureAuthenticated_user: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in as a user');
      res.redirect('/user/login');
    },

    //For admin
  
    ensureAuthenticated_admin: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in as a admin');
      res.redirect('/admin/login');
    }
  }