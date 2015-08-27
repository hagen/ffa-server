
module.exports = function(app) {
  // middleware specific to this router
  app.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });

  app.get('/api/redshift', function(req, res) {
      require('./redshift.js')(req, res);
    });

  app.get('/api/hdb', function(req, res) {
      require('./hdb.js')(req, res);
    });

  app.get('/api/sheets', function(req, res) {
      require('./sheets.js')(req, res);
    });
}
