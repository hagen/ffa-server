module.exports = {

    google : {
        clientID      : '622549728825-of3eulqv67r3uf0a4g5gmf8o2pf064ek.apps.googleusercontent.com',
        clientSecret  : 'Nl2gm4hau8kims6X3Y0ZKDak',
        callbackURL   : 'http://localhost:8080/auth/google/callback'
    },
    scn : {
        path : '/auth/scn/callback',
				entryPoint : 'https://accounts.sap.com/saml2/idp/sso',
				issuer : 'passport-saml'
    }

};
