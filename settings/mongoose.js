module.exports = function(mongoose){

	var db  = require('../config').database;
	return mongoose.connect(db.url.mongolab);

};
