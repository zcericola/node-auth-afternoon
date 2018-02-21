const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require(`${__dirname}/strategy`);
const {secret, clientID} = require(`${__dirname}/../config`);
const request = require('request');



const app = express();

//configures express
app.use( session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 100000
  }
}));

//middlewares
app.use( passport.initialize());
app.use( passport.session());
passport.use( strategy );

passport.serializeUser( (user, done) => {
  done(null,user);
})

passport.deserializeUser( (user, done) => {
  done(null, user);
})

//endpoint for the user when they try to login
app.get('/login', passport.authenticate('auth0', {
  successRedirect: '/followers',
  failureRedirect: '/login',
  failureFlash: true
}))

//endpoint to get user info if login was successful, otherwise, it will go back to the login page.
app.get("/followers", (req, res, next) => {  
  // if (req.user) { res.status(200).json(req.user); } 
   if (req.user) {
     const FollowersRequest = { url: `https://api.github.com/users/${req.user.nickname}/followers`, headers: { "User-Agent": clientID } };

     request(FollowersRequest, (error, response, body) => {
       res.status(200).send(body);
     });
   } else {
     res.redirect("/login");
   } 
    
    
});



const port = 3001;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );