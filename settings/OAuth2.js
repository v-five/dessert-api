
module.exports = {

	set : function(server, login, passport){

			this.OAuth2 = {

				authorization: [
					login.ensureLoggedIn(),
					server.authorization(function(clientID, redirectURI, done) {
						var client = { id: 1, name: 'Dessert-Web', clientId: 'abc123', clientSecret: 'ssh-secret' };
						return done(null, client, redirectURI);
					}),
					function(req, res){
						res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client, scope: req.query.scope.split(" ") });
					}
				],

				decision: [
					login.ensureLoggedIn(),
					server.decision()
				],

				token: [
					passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
					server.token(),
					server.errorHandler()
				]

			}
		},

	get : function(){
		return this.OAuth2;
	}

};