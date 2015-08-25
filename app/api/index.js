var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/api/redshift', function(req, res) {
    require('./api/redshift.js')(req, res);
  });

router.get('/api/hdb', function(req, res) {
    require('./api/hdb.js')(req, res);
  });

router.get('/api/sheets', function(req, res) {
    require('./api/sheets.js')(req, res);
  });

module.exports = router;
