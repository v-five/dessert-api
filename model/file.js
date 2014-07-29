
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var File = new Schema({

	owner        : {
		_id         : Schema.Types.ObjectId,
		username    : String
	},
	type         : String,
	name         : String,
	route        : String,
	content      : [File],
	parent       : [File],
	shared       : [{
		user        : Schema.Types.ObjectId,
		username    : String
	}]
});

// create the model for files and expose it to our app
module.exports = mongoose.model('File', File);
