
var User     = require('../model').user;
var File     = require('../model').file;

exports.findById = function(id, done){

	User.findById(id, function(err, user) {
		done(err, user);
	});

};

exports.get = function(owner, route, done) {

	File.findOne({"owner.username": owner, route: route}, function(err, file) {

		if (err)
			return done(err);

		if (!file && route == '/')
			return User.findOne({username: owner}, function(err, user) {

				if(err)
					return done(err);

				if(!user)
					return done(null, false);

				var newFile     = new File();

				newFile.owner.username  = user.username;
				newFile.owner._id       = user._id;
				newFile.fileType        = 'root';
				newFile.route           = '/';
				newFile.parent          = '.';
				newFile.name            = '';
				newFile.content         = [];
				newFile.shared          = [];

				newFile.save(function (err) {
					if (err)
						return done(err);

					return done(null, newFile);
				});

			});

		if (!file)
			return done(null, false);

		done(null, file);
	});
};

exports.create = function(file, done) {

	File.findOne({"owner.username": file.owner, route: file.parent}, function(err, parent) {

		if (err)
			return done(err);

		if (!parent)
			return done(null, false);

		User.findOne({username: file.owner}, function(err, user) {

			if(err)
				return done(err);

			if(!user)
				return done(null, false);

			var newFile     = new File();

			newFile.owner.username  = user.username;
			newFile.owner._id       = user._id;
			newFile.fileType        = file.fileType;
			newFile.route           = file.parent + (file.parent.slice(-1)=='/'?'':"/") + file.name;
			newFile.parent          = file.parent;
			newFile.name            = file.name;
			newFile.content         = [];
			newFile.shared          = [];

			newFile.save(function (err) {
				if (err)
					return done(err);

				parent.content.push(newFile);

				parent.save(function(err){

					if (err)
						return done(err);

					done(null, parent);
				});
			});
		});
	});
};