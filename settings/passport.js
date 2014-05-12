
module.exports = function(passport){

	var LocalStrategy           = require('passport-local').Strategy;
	var BasicStrategy           = require('passport-http').BasicStrategy;
	var BearerStrategy          = require('passport-http-bearer').Strategy;
	var ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
	var FacebookStrategy        = require('passport-facebook').Strategy;
	var User       		        = require('../handler').user;
	var config                  = require('../config');



	// ****************************************** //
	// ********* PASSPORT SESSION SETUP ********* //
	// ****************************************** //

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, done);
	});



	// ****************************************** //
	// *********** DESSERT LOGIN SETUP ********** //
	// ****************************************** //

	// dessert login
	passport.use('dessert', new LocalStrategy({
				usernameField : 'username',
				passwordField : 'password',
				passReqToCallback : true
			},
			function(req, username, password, done) {
				User.login(req, done);
			}
	));



	// ****************************************** //
	// *********** DESSERT LOGIN SETUP ********** //
	// ****************************************** //

	passport.use('dessert-register', new LocalStrategy({
				usernameField : 'username',
				passwordField : 'password',
				passReqToCallback : true
			},
			function(req, username, password, done) {
				process.nextTick(function() {
					User.register(req, done);
				});
			}
	));



	// ****************************************** //
	// ********** FACEBOOK LOGIN SETUP ********** //
	// ****************************************** //

	passport.use(new FacebookStrategy({
				clientID        : config.auth.facebook.clientID,
				clientSecret    : config.auth.facebook.clientSecret,
				callbackURL     : config.auth.facebook.callbackURL
			},
			function(token, refreshToken, profile, done) {
				User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

					if(err)
						return done(err);

					if(user)
						return done(null, user);

					else{

						var newUser            = new User();
						newUser.facebook.id    = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;

						newUser.save(function(err) {
							if (err)
								throw err;

							return done(null, newUser);
						});
					}
				});
			}
	));


	passport.use(new BasicStrategy({
				passReqToCallback : true
			},
			function(username, password, done) {
				var client = { id: 1, name: 'Dessert-Web', clientId: 'abc123', clientSecret: 'ssh-secret' }
//				db.clients.findByClientId(username, function(err, client) {
//					if (err) { return done(err); }
//					if (!client) { return done(null, false); }
//					if (client.clientSecret != password) { return done(null, false); }
					return done(null, client);
//				});
			}
	));

	passport.use(new ClientPasswordStrategy(
			function(clientId, clientSecret, done) {
				var client = { id: 1, name: 'Dessert-Web', clientId: 'abc123', clientSecret: 'ssh-secret' };
//				db.clients.findByClientId(clientId, function(err, client) {
//					if (err) { return done(err); }
//					if (!client) { return done(null, false); }
//					if (client.clientSecret != clientSecret) { return done(null, false); }
					return done(null, client);
//				});
			}
	));

	passport.use(new BearerStrategy(
			function(accessToken, done) {
				User.bearerLogin(accessToken, done);
			}
	));
}