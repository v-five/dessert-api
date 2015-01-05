
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var File = new Schema({

	owner        : { type: Schema.Types.ObjectId, ref: 'User'},
	type         : String,
	name         : String,
	route        : String,
	content      : [{ type: Schema.Types.ObjectId, ref: 'File' }],
	binary       : Buffer,
	parent       : { type: Schema.Types.ObjectId, ref: 'File' },
	shared       : [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

// create the model for files and expose it to our app
module.exports = mongoose.model('File', File);

File.pre('remove', function(next){
	this.model('File').update(
		{_id: this.parent},
		{$pull: {content: this._id}},
		false,
		next
	);
});