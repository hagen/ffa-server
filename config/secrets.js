module.exports = {

  google : {
    clientID      : process.env.GOOGLE_CLIENT_ID || '622549728825-of3eulqv67r3uf0a4g5gmf8o2pf064ek.apps.googleusercontent.com',
    clientSecret  : process.env.GOOGLE_CLIENT_SECRET || 'Nl2gm4hau8kims6X3Y0ZKDak',
    callbackURL        : process.env.GOOGLE_CALLBACK || 'http://hagen.forefrontanalytics.com.au/auth/google/callback',
    callbackURLConnect : process.env.GOOGLE_CONNECT_CALLBACK || 'http://hagen.forefrontanalytics.com.au/connect/google/callback'
  },
  twitter : {
    consumerKey     : process.env.TWITTER_CLIENT_ID || 'NmNJhNviadiR6CAxhAENmeQTr',
    consumerSecret  : process.env.TWITTER_CLIENT_SECRET || '7WLn0fRgxxFgqkpl77ca9wMIHfpYHIZMJcItl6ZHZ9lGsoLIQf',
    callbackURL        : process.env.TWITTER_CALLBACK || 'http://hagen.forefrontanalytics.com.au/auth/twitter/callback',
    callbackURLConnect : process.env.TWITTER_CONNECT_CALLBACK || 'http://hagen.forefrontanalytics.com.au/connect/twitter/callback'
  },
  linkedin : {
    clientID      : process.env.LINKEDIN_CLIENT_ID || '75dtqjtvsus2km',
    clientSecret  : process.env.LINKEDIN_CLIENT_SECRET || 'sMShpaelT6H0t8Wa',
    callbackURL        : process.env.LINKEDIN_CALLBACK || 'http://hagen.forefrontanalytics.com.au/auth/linkedin/callback',
    callbackURLConnect : process.env.LINKEDIN_CONNECT_CALLBACK || 'http://hagen.forefrontanalytics.com.au/connect/linkedin/callback'
  },
  braintree : {
    merchantId : process.env.BRAINTREE_MERCHANT_ID || "t3827896pz26dd73",
    publicKey : process.env.BRAINTREE_PUBLIC_KEY || "cyjcxxq2kpxsf6v8",
    privateKey : process.env.BRAINTREE_PRIVAYE_KEY || "eaeb202c5d0f1dd10451d2f4f40ddf04"
  }
};
