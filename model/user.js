
var bcrypt      = require('bcrypt-nodejs');
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var User = new Schema({

	username     : String,
	fullname     : String,
	password     : String,
	email        : String,
	friends      : [Schema.Types.ObjectId],

	facebook     : {
		id          : String,
		token       : String,
		email       : String,
		name        : String
	},

	google       : {
		id           : String,
		token        : String,
		email        : String,
		name         : String
	}

});

// generating password hash
User.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', User);
