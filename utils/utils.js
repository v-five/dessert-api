
exports.isLoggedIn = function(req, res, next){
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
};

exports.generateUID = function(length){
	var len = length || 32;
	var uid = [];
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < len; ++i) {
		uid.push(chars[getRandomInt(0, chars.length - 1)]);
	}
	return uid.join('');
//	return require('node-uuid').v4();
};

var getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}