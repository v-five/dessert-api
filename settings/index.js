
module.exports = {

	set : {

		app         : function(app){
						require('./app')(app);
					},

		routes      : function(app, passport){
						require('./routes')(app, passport);
					},

		passport    : function(passport){
						require('./passport')(passport);
					},

		mongoose    : function(mongoose){
						require('./mongoose')(mongoose);
					}
	}

};