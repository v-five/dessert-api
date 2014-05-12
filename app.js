
var express     = require('express');
var set         = require('./settings').set;
var port        = process.env.PORT || 3000;

// app init
var app = express();

// app config
set.app(app);

// app listen
app.listen(port, function(){
	console.log('Dessert API started on port ' + port);
});