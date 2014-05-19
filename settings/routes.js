
module.exports = function(app, passport) {

	// Home page
	app.get('/', function(req, res){
		res.redirect("profile");
	});



	// ****************************************** //
	// ******************* API ****************** //
	// ****************************************** //

	app.get('/api/userinfo', passport.authenticate('bearer', { session: false }),
			function(req, res) {
				res.json(req.user);
	});

}