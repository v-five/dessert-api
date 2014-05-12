
module.exports = function(app, passport, oauth2) {

	var user        = require('../handler').user;
	var	query       = require('querystring');

	var isLoggedIn  = function (req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/login?' + query.stringify({backUrl: req.url}));
	}

	// Home page
	app.get('/', function(req, res){
		res.redirect("profile");
	});

	app.get('/profile', isLoggedIn, function(req, res){
		res.render("profile");
	});



	// ****************************************** //
	// ************* AUTHENTICATION ************* //
	// ****************************************** //

	// Login page
	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage') });
	});

	// Process the authentication
	app.post('/login',  passport.authenticate('dessert', {
		successReturnToOrRedirect : '/profile',
		failureRedirect : '/login'
	}));

	// Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});



	// ****************************************** //
	// ************** REGISTRATION ************** //
	// ****************************************** //

	// Register page
	app.get('/register', function(req, res) {
		res.render('register', { message: req.flash('registerMessage') });
	});

	// Process the registration
	app.post('/register', passport.authenticate('dessert-register', {
		successRedirect : '/profile',
		failureRedirect : '/register'
	}));



	// ****************************************** //
	// *************** OAUTH 2.0  *************** //
	// ****************************************** //

	app.get ('/oauth2',          oauth2.authorization);
	app.post('/oauth2/decision', oauth2.decision);
	app.post('/oauth2/token',    oauth2.token);



	// ****************************************** //
	// ******************* API ****************** //
	// ****************************************** //

	app.get('/api/userinfo',
			passport.authenticate('bearer', { session: false }),
			function(req, res) {
				res.json(req.user);
			});



	// ***************************************** //
	// ************ USER MANAGEMENT ************ //
	// ***************************************** //

	app.get('/user/list', user.list());
	app.post('/user/add', user.add());
	app.patch('/user/update/:id', user.patch());
	app.delete('/user/delete/:id', user.delete());

}