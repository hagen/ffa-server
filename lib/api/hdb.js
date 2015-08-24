module.exports = function(req, res) {
  var hdb = require("hdb");
  var client = hdb.createClient({
    host: 'hana.forefrontanalytics.com.au',
    port: 30015,
    user: 'HDITTMER',
    password: 'H4n4u53r'
  });
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
