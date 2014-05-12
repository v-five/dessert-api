
module.exports = {

	set : {

		app         : function(app){
						require('./app')(app);
					},

		routes      : function(app, passport, oauth2){
						require('./routes')(app, passport, oauth2);
					},

		passport    : function(passport){
						require('./passport')(passport);
					},

		mongoose    : function(mongoose){
						require('./mongoose')(mongoose);
					},

		OAuth2orize : function(oauth2orize, server){
						require('./OAuth2orize')(oauth2orize, server);
					},

		OAuth2      : function(server, login, passport){
						require('./OAuth2').set(server, login, passport);
					}

	},

	get : {

		OAuth2      : function(){
						return require('./OAuth2').get();
					}

	}

};