
// app config
module.exports = function(app){

	var swig         = require('swig');
	var mongoose     = require('mongoose');
	var bodyParser   = require('body-parser');
	var cookieParser = require('cookie-parser');
	var session      = require('express-session');
	var passport     = require('passport');
	var flash        = require('connect-flash');
	var login        = require('connect-ensure-login');
	var set          = require('../settings').set;
	var get          = require('../settings').get;
	var oauth2orize  = require('oauth2orize');
	var server       = oauth2orize.createServer();

	set.mongoose(mongoose);
	set.passport(passport);
	set.OAuth2orize(oauth2orize, server);
	set.OAuth2(server, login, passport)

	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');

	app.use(bodyParser());
	app.use(cookieParser());

	app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	set.routes(app, passport, get.OAuth2());

};