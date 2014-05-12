
module.exports= function(oauth2orize, server){

	var User     = require('../handler').user;

	server.serializeClient(function(client, done) {
		var client = { id: 1, name: 'Samplr', clientId: 'abc123', clientSecret: 'ssh-secret' };
		return done(null, client.id);
	});

	server.deserializeClient(function(id, done) {
		var client = { id: 1, name: 'Samplr', clientId: 'abc123', clientSecret: 'ssh-secret' };
		return done(null, client);
	});

	server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
		User.generateExchangeCode(user, client, done);
	}));

	server.exchange(oauth2orize.exchange.code(function(client, exchangeCode, redirectURI, done) {
		User.generateAccessToken(client, exchangeCode, done);
	}));

};