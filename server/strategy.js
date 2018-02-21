const {domain, clientID, clientSecret} = require(`${__dirname}/../config`);
const Auth0Strategy = require('passport-auth0');

module.exports = new Auth0Strategy({
    domain: domain,
    clientID: clientID,
    clientSecret: clientSecret,
    scope: "profile openid",
    callbackURL: '/login'

}, function(accessToken, refreshToken, extraParams, profile, done){
//accessToken is the token to call Auth0 API
//extraParams.id_token has the JSON web token
//profile has all the information from the user

    return done(null, profile);
})




