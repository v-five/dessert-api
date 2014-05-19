
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var Token = new Schema({

	token       : String,
	type        : String,
	user        : Schema.Types.ObjectId,
	scope       : Schema.Types.Mixed,
//	client      : Schema.Types.ObjectId,
	client      : Number,
	created     : { type: Date, default: Date.now() },
	expire      : { type: Date, default: (Date.now() + 10*60*1000) }

});

// checking if token expired
Token.methods.expired = function() {
	return new Date(this.expire).getTime() < Date.now();
};

module.exports = mongoose.model('Token', Token);