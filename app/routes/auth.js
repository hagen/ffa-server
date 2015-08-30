// load up the user model
var User = require('../models/user');

module.exports = function(app, passport) {
  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/#/login');
  });

  // =====================================
  // LINKING =============================
  // =====================================
  app.post('/auth/profile/link', passport.authenticate('bearer', {
    session: false
  }), function(req, res) {
    if(req.body.link && req.user) {
      req.user.set('linkToken', req.body.link);
      req.user.save(function(err) {
        if(err) {
          res.json({
            status : 'Failed',
            message : 'Couldn\'t save link token'
          });
        } else {
          res.json({
            status : 'Success',
            message : 'Link token saved'
          });
        }
      });
    }
  });

  // =====================================
  // LOCAL ===============================
  // =====================================
  // process the signup form
  app.post('/auth/signup', passport.authenticate('local-signup', {
    successRedirect: 'http://localhost:8080/#/plans', // redirect to the secure profile section
    failureRedirect: 'http://localhost:8080/#/noauth', // redirect back to the signup page if there is an error
    failureFlash: false // allow flash messages
  }));

  // process the login form
  app.post('/auth/login', passport.authenticate('local-login', {
    successRedirect: 'http://localhost:8080/#/dash', // redirect to the secure profile section
    failureRedirect: 'http://localhost:8080/#/noauth', // redirect back to the signup page if there is an error
    failureFlash: false // allow flash messages
  }));

  // =====================================
  // GOOGLE ==============================
  // =====================================
  app.get('/auth/google', passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:8080/#/noauth'
  }), function(req, res) {
    res.redirect('http://localhost:8080/#/auth/google/token/' + req.user.accessToken);
  });

  // send to google to do the authorization
  app.get('/connect/google', passport.authenticate('google-connect', {
    session: false,
    scope: ['profile', 'email']
  }));

  // the callback after google has authorized the user
  app.get('/connect/google/callback', passport.authenticate('google-connect', {
    session: false,
    failureRedirect: '/'
  }), function(req, res) {
    // Note that there is a subtle difference in this URL. /#/connect
    // is a route in UI5. /connect is a location on the server
    res.redirect('http://localhost:8080/#/connect/google/token/' + req.user.accessToken);
  });

  // Merge Google account
  app.post('/auth/profile/merge/google', passport.authenticate('bearer', {
    session: false
  }), function(req, res) {

    if (req.body.link && req.user) {
      User.findOne({
        linkToken : req.body.link
      }, function(err, existingUser) {
        if (err || !existingUser) {
          res.json({
            status : 'Error',
            message: 'User couldn\'t be found to merge'
          });
        } else  {
          existingUser.set('accessToken', req.user.accessToken);
          existingUser.set('google.id', req.user.google.id);
          existingUser.set('google.token', req.user.google.token);
          existingUser.set('google.email', req.user.google.email);
          existingUser.set('google.name', req.user.google.name);
          existingUser.save(function(err) {
            if(err) {
              res.json({
                status : 'Error',
                message : 'User\'s Google credentials couldn\'t be saved'
              });
            } else {
              User.remove({ _id : req.user._id }, function(err) {
                res.json({
                  status : 'Success',
                  message : 'User\'s Google credentials merged and old user deleted!'
                });
              });
            }
          });
        }
      });
    }
  });

  // Disconnect Google
  app.get('/disconnect/google', passport.authenticate('bearer', {
    session: false,
  }), function(req, res) {
    var user          = req.user;
    user.google.token = undefined;
    user.save(function(err) {
       res.json({ message : 'Google unlinked' });
    });
  });

  // =====================================
  // TWITTER =============================
  // =====================================
  app.get('/auth/twitter', passport.authenticate('twitter', {
    session: false,
    scope : 'email'
  }));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    session: false,
    failureRedirect: 'http://localhost:8080/#/noauth'
  }), function(req, res) {
    res.redirect('http://localhost:8080/#/auth/twitter/token/' + req.user.accessToken);
  });

  // send to google to do the authentication
  app.get('/connect/twitter', passport.authenticate('twitter-connect', {
    session: false,
    scope : 'email'
  }));

  // the callback after google has authorized the user
  app.get('/connect/twitter/callback', passport.authenticate('twitter-connect', {
    session: false,
    failureRedirect: '/'
  }), function(req, res) {
    // Note that there is a subtle difference in this URL. /#/connect
    // is a route in UI5. /connect is a location on the server
    res.redirect('http://localhost:8080/#/connect/twitter/token/' + req.user.accessToken);
  });

  // Merge Twitter
  app.post('/auth/profile/merge/twitter', passport.authenticate('bearer', {
    session: false
  }), function(req, res) {

    if (req.body.link && req.user) {
      User.findOne({
        linkToken : req.body.link
      }, function(err, existingUser) {
        if (err || !existingUser) {
          res.json({
            status : 'Error',
            message: 'User couldn\'t be found to merge'
          });
        } else  {
          existingUser.set('accessToken', req.user.accessToken);
          existingUser.set('twitter.id', req.user.twitter.id);
          existingUser.set('twitter.token', req.user.twitter.token);
          existingUser.set('twitter.displayName', req.user.twitter.displayName);
          existingUser.set('twitter.username', req.user.twitter.username);
          existingUser.save(function(err) {
            if(err) {
              res.json({
                status : 'Error',
                message : 'User\'s Twitter credentials couldn\'t be saved'
              });
            } else {
              User.remove({ _id : req.user._id }, function(err) {
                res.json({
                  status : 'Success',
                  message : 'User\'s Twitter credentials merged and old user deleted!'
                });
              });
            }
          });
        }
      });
    }
  });

  // Disconnect Twitter
  app.get('/disconnect/twitter', passport.authenticate('bearer', {
    session: false,
  }), function(req, res) {
    var user           = req.user;
    user.twitter.token = undefined;
    user.save(function(err) {
       res.json({ message : 'Twitter unlinked' });
    });
  });

  // =====================================
  // LINKEDIN ============================
  // =====================================
  app.get('/auth/linkedin', passport.authenticate('linkedin', {
    session : false,
    scope: ['r_basicprofile', 'r_emailaddress']
  }));

  app.get('/auth/linkedin/callback', passport.authenticate(['bearer','linkedin'], {
    session: false,
    failureRedirect: 'http://localhost:8080/#/noauth'
  }), function(req, res) {
    res.redirect('http://localhost:8080/#/auth/linkedin/token/' + req.user.accessToken);
  });

  // send to google to do the authentication
  app.get('/connect/linkedin', passport.authenticate('linkedin-connect', {
    session: false,
    scope: ['r_basicprofile', 'r_emailaddress']
  }));

  // the callback after LinkedIn has authorized the user
  app.get('/connect/linkedin/callback', passport.authenticate('linkedin-connect', {
    session: false,
    failureRedirect: 'http://localhost:8080/#/noauth'
  }), function(req, res) {
    // Note that there is a subtle difference in this URL. /#/connect
    // is a route in UI5. /connect is a location on the server
    res.redirect('http://localhost:8080/#/connect/linkedin/token/' + req.user.accessToken);
  });

  // Merge LinkedIn
  app.post('/auth/profile/merge/linkedin', passport.authenticate('bearer', {
    session: false
  }), function(req, res) {

    if (req.body.link && req.user) {
      User.findOne({
        linkToken : req.body.link
      }, function(err, existingUser) {
        if (err || !existingUser) {
          res.json({
            status : 'Error',
            message: 'User couldn\'t be found to merge'
          });
        } else  {
          existingUser.set('accessToken', req.user.accessToken);
          existingUser.set('linkedin.id', req.user.linkedin.id);
          existingUser.set('linkedin.token', req.user.linkedin.token);
          existingUser.set('linkedin.email', req.user.linkedin.email);
          existingUser.set('linkedin.firstname', req.user.linkedin.firstname);
          existingUser.set('linkedin.lastname', req.user.linkedin.lastname);
          existingUser.set('linkedin.headline', req.user.linkedin.headline);
          existingUser.save(function(err) {
            if(err) {
              res.json({
                status : 'Error',
                message : 'User\'s LinkedIn credentials couldn\'t be saved'
              });
            } else {
              User.remove({ _id : req.user._id }, function(err) {
                res.json({
                  status : 'Success',
                  message : 'User\'s LinkedIn credentials merged and old user deleted!'
                });
              });
            }
          });
        }
      });
    }
  });

  // Disconnect LinkedIn
  app.get('/disconnect/linkedin', passport.authenticate('bearer', {
    session: false,
  }), function(req, res) {
    var user            = req.user;
    user.linkedin.token = undefined;
    user.save(function(err) {
       res.json({ message : 'LinkedIn unlinked' });
    });
  });

  // =====================================
  // PROFILE =============================
  // =====================================
  app.get('/auth/api/user', passport.authenticate('bearer', {
    session: false
  }), function(req, res) {
    res.json({
      userid: req.user._id
    });
  });

  app.get('/auth/api/profile', passport.authenticate('bearer', {
    session: false
  }), function(req, res) {
    res.json(req.user);
  });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}