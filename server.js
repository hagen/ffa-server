// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
router.route("/redshift")
  .get(function(req, res) {
    var pg = require("pg");

    var oOptions = {
      user : req.get("X-Redshift-user"),
      password : req.get("X-Redshift-password"),
      database : req.get("X-Redshift-database"),
      host : req.get("X-Redshift-endpoint"),
      port : req.get("X-Redshift-port")
    };

    // Connect
    pg.connect(oOptions, function(err, client, done) {
      if (err) {
        res.json({ error : true, message: 'Connection error' });
        return console.error('Connect error', err);
      }

      var query = req.get("X-Redshift-query") || "select count(*) from pg_table_def;";
      client.query(query, function(err, rows) {
        client.end();
        if (err) {
          res.json({
            error : true,
            message: err
          });
          return console.error('Query error:', err);
        }

        console.log("Table rows read: ", rows.rows.length);

        // Now we'll take the row schema.
        var jmd = require("jmd");
        jmd.getMetadata(rows.rows).get("schema").then(function(schema) {
          var length = require("stringbitlength");
          var bytes = length(JSON.stringify(rows.rows));
          res.json({
            schema : schema,
            bytes : bytes,
            rows : rows.rows
          });

          // Log return
          console.log("Returned " + bytes + " bytes to caller");
        });
      });

      // All done, thanks
      done();
    });

    pg.end();
  });

router.route('/hdb')
        /***
        *    ██╗  ██╗██████╗ ██████╗
        *    ██║  ██║██╔══██╗██╔══██╗
        *    ███████║██║  ██║██████╔╝
        *    ██╔══██║██║  ██║██╔══██╗
        *    ██║  ██║██████╔╝██████╔╝
        *    ╚═╝  ╚═╝╚═════╝ ╚═════╝
        *
        */
      .get(function(req, res) {
        var hdb = require("hdb");
        var client = hdb.createClient({
          host     : 'hana.forefrontanalytics.com.au',
          port     : 30015,
          user     : 'HDITTMER',
          password : 'H4n4u53r'
        });
        client.on('error', function (err) {
          console.error('Network connection error', err);
        });
        client.connect(function (err) {
          if (err) {
            return console.error('Connect error', err);
          }
          client.exec('select * from "HDITTMER"."fa.ppo.drop3.xs.models::dataset.datasource_type"', function (err, rows) {
            client.end();
            if (err) {
              return console.error('Execute error:', err);
            }
            console.log('Results:', rows);
          });
        });
        res.json({ message: 'HDB was read!' });
      });

// Google Sheets route
router.route('/sheets')
      /***
       *    ███████╗██╗  ██╗███████╗███████╗████████╗███████╗
       *    ██╔════╝██║  ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
       *    ███████╗███████║█████╗  █████╗     ██║   ███████╗
       *    ╚════██║██╔══██║██╔══╝  ██╔══╝     ██║   ╚════██║
       *    ███████║██║  ██║███████╗███████╗   ██║   ███████║
       *    ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
       *
       */
      .get(function(req, res) {
        var GoogleSpreadsheet = require("google-spreadsheet");

        var sKey = req.get("X-Sheet-Key");
        console.log("Doc key:", sKey);
        var oSheet = new GoogleSpreadsheet(sKey);

        if(oSheet) {
          console.log("Got the Google Sheet!");
        } else {
          console.error("Error retrieving sheet");
          res.json({ message : "Error reading sheet" });
          return;
        }

        // Read in the first sheet only.
        oSheet.getInfo(function( err, info) {
          var moment = require("moment");
          var worksheet = info.worksheets[0];
          worksheet.getRows(function(err, rows) {
            // we'll return our rows after they've been parsed
            var aRows = [];

            // let's figure out the actual types of each of these too?!
            for(var i = 0; i < rows.length; i++) {
              var oRow = {};

              // Our index counter for the column definition
              var j = 0;
              var k = 1;

              // Spin through the entries of this object
              for(var attr in rows[i]) {
                if(rows[i].hasOwnProperty(attr) && ["_xml", "title", "content", "_links", "save", "del", "id"].indexOf(attr) === -1) {

                  // grab the value - we'll need it.
                  var vValue = rows[i][attr];

                  if(vValue) {
                    // Try and get a date out of it...
                    if (moment(vValue, "YYYY-MM-DD").isValid()){
                      // Take the date value
                      oRow[attr] = moment(vValue).toISOString();

                    } else if(!Number.isNaN(vValue)) {
                      // Check if it is a number
                      // try for a decimal
                      if(vValue.indexOf(".") > -1) {
                        oRow[attr] = parseFloat(vValue);
                      } else {
                        oRow[attr] = parseInt(vValue, 10);
                      }
                    } else {
                      oRow[attr] = vValue;
                    }
                  }
                }
              }
              // add the row to our row array...
              aRows.push(oRow);
            }

            // The training data should be sorted from lowest date to highest, so
            // order by date, ascending.
            aRows.sort(function(a, b) {
              // Because we have stored the momentjs value, use moment to do the
              // compares.
              if (moment(a.date).isBefore(moment(b.date))) {
                return -1;
              }
              if (moment(a.date).isAfter(moment(b.date))) {
                return 1;
              }
              return 0;
            });

            console.log("Table rows read: ", aRows.length);

            // Now we'll take the row schema.
            var jmd = require("jmd");
            jmd.getMetadata(aRows).get("schema").then(function(schema) {
              // We'll also need the size (bytes) of the data set.
              var length = require("stringbitlength");
              var bytes = length(JSON.stringify(aRows));
              res.json({
                title: worksheet.title,
                schema : schema, // note this is actually an object (named array)
                bytes : bytes,
                rows : aRows
              });

              // Log return
              console.log("Returned " + bytes + " bytes to caller");
            });
          });
        });
      });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
