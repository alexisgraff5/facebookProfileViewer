var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');

var app = express();

app.use(session({
  secret: config.sessionSecret
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: config.facebookId,
  clientSecret: config.facebookSecret,
  callbackURL: config.baseDomain + '/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  // code goes here
    // go to database and look for profile.id
    // create user using profile.id
    return done(null/*error*/, profile/*info that goes on session*/);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/login'
}), function(req, res) {
	console.log(req.session);
});

// HERE TO HELP WITH session
// PREPS data to put on session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// GETS data from session and preps req.user
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/me', function(req, res) {
  res.send(req.user);
});

app.listen('3000', function(){
  console.log("Successfully listening on : 3000");
});
