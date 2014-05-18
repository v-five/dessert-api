
var User     = require('../model').user;
var Token    = require('../model').token;
var utils    = require('../utils');

// GET all users
exports.list = function() {
	return function(req, res) {
		User.find({}, function(err, users) {
			if(err) res.send(err);
			else if(!users) res.send("No users.");
			else res.send(users);
		});
	}
};


// POST user
exports.add = function(db) {
	return function(req, res) {
		var newUser = new User({username: req.body.username, email: req.body.email, password:  req.body.password});
		newUser.save(function(err) {
			if(err) res.send(err);
			else res.send(true);
		});
	}
};

exports.generateExchangeCode = function(user, client, done){
	var exchangeCode     = utils.generateUID();
	var dateNow          = Date.now();
	var newToken         = new Token();

	newToken.token       = exchangeCode;
	newToken.type        = 'exchange';
	newToken.user        = user.id;
	newToken.client      = client.id;
	newToken.scope       = client.scope;
	newToken.created     = dateNow;
	newToken.expire      = dateNow + 10*60*1000;

	newToken.save(function (err) {
		if (err)
			return done(err);
		return done(null, exchangeCode);
	});
};

exports.generateAccessToken = function(client, exchangeCode, done){

	Token.findOne({type: 'exchange', token: exchangeCode}, function(err, exchangeToken) {

		if (err)
			return done(err);

		if (!exchangeToken)
			return done(null, false);

		if (exchangeToken.expired())
			return done(null, false);

		if (client.id !== exchangeToken.client)
			return done(null, false);

//		if (redirectURI !== exchangeCode.redirectURI)
//          return done(null, false);

		exchangeToken.remove(function (err) {
			if(err)
				return done(err);

			var accessToken  = utils.generateUID(256);
			var dateNow      = Date.now();
			var newToken     = new Token();

			newToken.token   = accessToken;
			newToken.type    = 'access';
			newToken.user    = exchangeToken.user;
			newToken.client  = exchangeToken.client;
			newToken.scope   = exchangeToken.scope;
			newToken.created = dateNow;
			newToken.expire  = dateNow + 24*60*60*1000;

			newToken.save(function (err) {
				if (err)
					return done(err);
				return done(null, accessToken, "refreshToken", {'expires_in': "24 hours"});
			});
		});
	});
}

exports.register = function(req, done){

	var formData = req.body;
	User.findOne({ 'email' :  formData.email }, function(err, user) {

		if (err)
			return done(err);

		if (user)
			return done(null, false, req.flash('registerMessage', 'That email is already taken.'));

		var newUser         = new User();

		newUser.email       = formData.email;
		newUser.username    = formData.username;
		newUser.password    = newUser.generateHash(formData.password);

		newUser.save(function(err) {
			if (err)
				throw err;
			return done(null, newUser);
		});

	});

}

exports.login = function(req, done){

	var formData = req.body;

	User.findOne({ 'username' : formData.username}, function(err, user) {

		if(err)
			return done(err);

		if(!user)
			return done(null, false, req.flash('loginMessage', 'No user found.'));

		if(!user.validPassword(formData.password))
			return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

		return done(null, user);

	});
}

exports.findById = function(id, done){

	User.findById(id, function(err, user) {
		done(err, user);
	});

};

exports.bearerLogin = function(accessCode, done) {

	Token.findOne({type: "access", token: accessCode}, function(err, accessToken) {

		console.log(err);
		console.log(accessToken);

		if (err)
			return done(err);

		if (!accessToken)
			return done(null, false, "Wrong access token.");

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

// DELETE user
exports.delete = function(db) {
	return function(req, res) {
		var mongodb = require('mongodb');
		var userid = new mongodb.ObjectID(req.params.id);
		var user = {_id: userid};
		db.users.remove(user, function(err, removed) {
			if(err) res.send(err);
			else if(!removed) res.send(false);
			else res.send(true);
		});
	}
};


// PATCH user
exports.patch = function(db) {
	return function(req, res) {
		var mongodb = require('mongodb');
		var userid = new mongodb.ObjectID(req.params.id);
		var user = {_id: userid};
		var patch = {$set: {password: 'testPass'}};
		db.users.remove(user, patch, function(err, updated) {
			if(err) res.send(err);
			else if(!updated) res.send(false);
			else res.send(true);
		});
	}
};