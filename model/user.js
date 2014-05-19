
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

// create the model for users and expose it to our app
module.exports = mongoose.model('User', User);
