module.exports = function(req, res) {
  var hdb = require("hdb");
  var oOptions = {
    host: req.get("X-HDB-host"), //'hana.forefrontanalytics.com.au',
    port: req.get("X-HDB-port"), //30015,
    user: req.get("X-HDB-user"), //
    password: req.get("X-HDB-password") //
  };

  var client = hdb.createClient(oOptions);
  client.on('error', function(err) {
    console.error('Network connection error', err);
  });
  client.connect(function(err) {
    if (err) {
      return console.error('Connect error', err);
    }
    client.exec('select * from "HDITTMER"."fa.ppo.drop3.xs.models::dataset.datasource_type"', function(err, rows) {
      client.end();
      if (err) {
        return console.error('Execute error:', err);
      }
      console.log('Results:', rows);
    });
  });
  res.json({
    message: 'HDB was read!'
  });
};
