
var User     = require('../model').user;
var File     = require('../model').file;

exports.findById = function(id, done){

	User.findById(id, function(err, user) {
		done(err, user);
	});

};

exports.get = function(owner, route, done) {

	User.findOne({username: owner}, function(err, user) {

		if (err)
			return done(err);

		if (!user)
			return done(null, false);

		File.findOne({"owner": user._id, route: route}).populate('content').populate('owner', "username").exec(function (err, file) {

			if (err)
				return done(err);

			if (!file && route == '/') {

				var newFile = new File();

				newFile.owner = user._id;
				newFile.type = 'dir';
				newFile.route = '/';
				newFile.parent = null;
				newFile.name = '';
				newFile.content = [];
				newFile.shared = [];

				return newFile.save(function (err) {
					if (err)
						return done(err);

					return done(null, newFile);
				});
			}

			if (!file)
				return done(null, false);

			User.populate(file.content, {path: 'owner', select: "username"}, function(err, content){

				if(err)
					done(err);

				if(!content)
					done(null, false);

				file.content = content;
				done(null, file);
			});
		});
	});
};

exports.create = function(file, done) {

	User.findOne({username: file.owner}, function(err, user) {

		if(err)
			return done(err);

		if(!user)
			return done(null, false);

		File.findOne({"owner": user._id, route: file.parent}, function(err, parent) {

			if (err)
				return done(err);

			if (!parent)
				return done(null, false);

			var newFile     = new File();

			newFile.owner           = user._id;
			newFile.type            = file.type;
			newFile.binary          = file.binary;
			newFile.route           = file.parent + (file.parent.slice(-1)=='/'?'':"/") + file.name;
			newFile.parent          = parent._id;
			newFile.name            = file.name;
			newFile.content         = [];
			newFile.shared          = [];

			newFile.save(function (err, f) {
				if (err) {
					return done(err);
				}

				parent.content.push(f._id);

				parent.save(function(err){

					if (err)
						return done(err);

					done(null, true);
				});
			});
		});
	});
};


exports.update = function(id, updates, done) {

	File.findById(id, function(err, file) {

		if (err)
			return done(err);

		if (!file)
			return done(null, false);


		for(var prop in updates){
			if(file.hasOwnProperty(prop)) file[prop] = updates[prop];
		}

		file.save(function (err) {
			if (err) {
				return done(err);
			}

			done(null, parent);
		});
	});
};

exports.delete = function(id, done) {
	deleteRecursive(id, function(err, res){
		if(err)
			return done(err);

		if(!res)
			return done(null, false);

		done(null, true);
	});
};

var deleteRecursive = function(id, done){
	File.findById(id, function(err, file) {

		if(err)
			return done(err);

		if(!file)
			return done(false);

		var error = null;
		var res = true;
		for(var i in file.content){
			if(i < file.content.length) {
				deleteRecursive(file.content[i], function (e, r) {
					error = e;
					res = r;
				});

				if (error)
					return done(error);
				if (!res)
					return done(null, false);
			}
		}

		file.remove(function(err){
			if (err)
				return done(err);

			done(null, true);
		});
	});
};