// app/routes.js
module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  // app.get('/', function(req, res) {
  //   res.json({ message: 'Hooray! Welcome to our API!' });
  // });

  // =====================================
  // API =================================
  // =====================================
  require('./api'); //index.js

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // =====================================
  // LOCAL ===============================
  // =====================================
  // process the signup form
  app.post('/auth/signup', passport.authenticate('local-signup', {
      successRedirect: 'http://localhost/app/#/plans', // redirect to the secure profile section
      failureRedirect: 'http://localhost/app/#/noauth', // redirect back to the signup page if there is an error
      failureFlash : false // allow flash messages
  }));

  // process the login form
  app.post('/auth/login', passport.authenticate('local-login', {
      successRedirect : 'http://localhost/app/#/dash', // redirect to the secure profile section
      failureRedirect : 'http://localhost/app/#/noauth', // redirect back to the signup page if there is an error
      failureFlash : false // allow flash messages
  }));

  // =====================================
  // GOOGLE ==============================
  // =====================================
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost/app/#/dash',
    failureRedirect: 'http://localhost/app/#/noauth'
  }));

  // =====================================
  // TWITTER =============================
  // =====================================
  app.get('/auth/twitter', passport.authenticate('twitter', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: 'http://localhost/app/#/dash',
    failureRedirect: 'http://localhost/app/#/noauth'
  }));

  // =====================================
  // LINKEDIN ============================
  // =====================================
  app.get('/auth/linkedin', passport.authenticate('linkedin', {
     scope: ['r_basicprofile', 'r_emailaddress']
  }));

  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: 'http://localhost/app/#/dash',
    failureRedirect: 'http://localhost/app/#/noauth'
  }));

  // =====================================
  // SAP IDP =============================
  // =====================================
  app.get('/auth/scn', passport.authenticate('saml', {
    failureRedirect: '/',
    failureFlash: true
  }), function(req, res) {
    res.redirect('http://localhost/app/#/dash');
  });

  app.get('/auth/scn/callback', passport.authenticate('saml', {
    failureRedirect: '/',
    failureFlash: true
  }), function(req, res) {
    res.redirect('http://localhost/app/#/dash');
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
