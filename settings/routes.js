
module.exports = function(app, passport) {

	var handler = require('../handler');

	// Home page
	app.get('/', function(req, res){
		res.redirect("profile");
	});



	// ****************************************** //
	// ******************* API ****************** //
	// ****************************************** //

	app.get('/api/profile', passport.authenticate('bearer', { session: false }),
			function(req, res) {
				res.json(req.user);
			});

	app.get('/api/files/:owner?/:route*?', passport.authenticate('bearer', { session: false }),
			function(req, res) {
				var owner    = req.params.owner;
				var route    = req.params.route;

				if(owner === undefined)
					owner = req.user.username;

				if(route === undefined)
					route = '/';

				handler.file.get(owner, route, function(err, file, info){

					if(err)
						return res.send(err);

					else if(!file)
						return res.json(info);

					res.json(file);
				});
			});

	app.post('/api/files/create', passport.authenticate('bearer', { session: false }),
			function(req, res) {
				handler.file.create(req.body, function(err, file, info){

					if(err)
						return res.send(err);

					else if(!file)
						return res.json(info);

					res.json(file);
				});
			});

}