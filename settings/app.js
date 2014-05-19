
// app config
module.exports = function(app){

	var swig         = require('swig');
	var mongoose     = require('mongoose');
	var passport     = require('passport');
	var config       = require("../config");
	var set          = require('../settings').set;

	set.mongoose(mongoose);
	set.passport(passport);

	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');


	set.routes(app, passport);

};