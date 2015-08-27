var proxy = require('express-http-proxy');
var secrets = require('../../config/proxy.js');

module.exports = function(app, passport) {

  app.get('/auth/api/user',passport.authenticate('bearer', {
    session: false
  }), function(req, res) {
    res.json({
      userid : req.user._id
    });
  });

  // For all GET requests, we *may* need a user name. If the requested url
  // contains the pattern TESTUSER, we will replace it with the user's user Id
  app.get('/fa/ppo/drop3/xs/services/*', passport.authenticate('bearer', {
    session: false
  }), proxy('hana.forefrontanalytics.com.au', {
    forwardPath: function(req, res) {
      // I need the user
      return require('url').parse(req.url).path.replace("TESTUSER", req.user.id);
    },
    decorateRequest: function(req) {
      req.headers['Authorization'] = secrets.digests[0];
      return req;
    }
  }));

  // POST requests.
  app.post('/fa/ppo/drop3/xs/services/*', passport.authenticate('bearer', {
    session: false
  }), proxy('hana.forefrontanalytics.com.au', {
    forwardPath: function(req, res) {
      return require('url').parse(req.url).path;;
    },
    decorateRequest: function(req) {
      req.headers['Authorization'] = secrets.digests[0];
      return req;
    }
  }));

  // DELETE
  app.delete('/fa/ppo/drop3/xs/services/*', passport.authenticate('bearer', {
    session: false
  }), proxy('hana.forefrontanalytics.com.au', {
    forwardPath: function(req, res) {
      return require('url').parse(req.url).path;;
    },
    decorateRequest: function(req) {
      req.headers['Authorization'] = secrets.digests[0];
      return req;
    }
  }));
  // What about delete, update and merge?
};
