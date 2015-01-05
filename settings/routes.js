
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
				var owner    = req.params.owner || req.user.username;
				var route    = req.params.route || "";

				route = '/' + route;
				route += req.params[0] || "";

				handler.file.get(owner, route, function(err, file, info){

					if(err)
						return res.send(err);

					else if(!file && info)
						return res.json(info);

					res.json(file);
				});
			});

	app.put('/api/files/create', passport.authenticate('bearer', { session: false }),
			function(req, res) {
				handler.file.create(req.body, function(err, file, info){

					if(err)
						return res.send(err);

					else if(!file)
						return res.json(info);

					res.json(file);
				});
			});

	app.post('/api/files/update/:id', passport.authenticate('bearer', { session: false }),
		function(req, res){
			handler.file.update(req.params.id, req.body, function(err, result){

				if(err)
					return res.send(err);

				res.json(result);
			});
		});

	app.delete('/api/files/delete/:id', passport.authenticate('bearer', { session: false }),
		function(req, res){
			handler.file.delete(req.params.id, function(err, result){

				if(err)
					return res.send(err);

				res.json(result);
			});
		});

};