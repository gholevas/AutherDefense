'use strict';

var router = require('express').Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var f73cc3b61f22c79019ca1e79f801e0d0650e40d3 = require('./keys.js').github
var User = require('../api/users/user.model');

router.get('/', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github', {
	successRedirect: '/stories',
	failureRedirect: '/signup'
}));

passport.use(new GitHubStrategy({
	clientID: '99a45522bda46b831ff3',
	clientSecret: f73cc3b61f22c79019ca1e79f801e0d0650e40d3,
	callbackURL: 'http://127.0.0.1:8080/auth/github/callback'
}, function (token, refreshToken, profile, done) { 
	User.findOne({'github.id': profile.id }, function (err, user) {
		if (err) done(err);
		else if (user) done(null, user);
		else {
			var email = profile.emails ? profile.emails[0].value : (profile.displayName.replace(/\s+/g, '_') + '@fake-auther-email.com');
			// var email = profile.emails[0].value;
			User.create({
				email: email,
				name: profile.displayName,
				github: {
					id: profile.id,
					name: profile.displayName,
					email: email,
					token: token
				}
			}, done);
		}
	});
}));

module.exports = router;