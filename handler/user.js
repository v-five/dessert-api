
var User     = require('../model').user;
var Token    = require('../model').token;

exports.findById = function(id, done){

	User.findById(id, function(err, user) {
		done(err, user);
	});

};

exports.bearerLogin = function(accessCode, done) {

	Token.findOne({type: "access", token: accessCode}, function(err, accessToken) {

		if (err)
			return done(err);

		if (!accessToken)
			return done(null, false, "Wrong access token.");

		if (accessToken.expired())
			return done(null, false, "Expired access token.");

		User.findById(accessToken.user, function(err, user) {

			if(err)
				return done(err);

			if(!user)
				return done(null, false, "No user found.");

			var info = { scope: '*' }

			done(null, user, info);

		});
	});
};