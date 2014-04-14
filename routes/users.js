/*
 * GET userslist
 */

exports.list = function(db) {
	return function(req, res) {
		db.users.find(function(err, users) {
			if(err) res.send(err);
			else if(!users) res.send("No users.");
			else res.send(users);
		});
	}
};


/*
 * POST user
 */

exports.add = function(db) {
	return function(req, res) {
		console.log(" ");
		console.log(" ");
		console.log(" ");
		console.log(req);
		console.log(" ");
		console.log(" ");
		console.log(" ");
		var user = {username: req.body.username, email: req.body.email, password: req.body.password, friends: [], content: []};
		db.users.save(user, function(err, saved) {
			if(err) res.send(err);
			else if(!saved) res.send(false);
			else res.send(true);
		});
	}
};


/*
 * DELETE user
 */

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


/*
 * PATCH user
 */

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