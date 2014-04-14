/**
 * Module dependencies.
 */

var express = require('express');
var users = require('./routes/users');
var bodyParser = require('body-parser');

var databaseUrl = "dessert:pVj7tZnB@ds039467.mongolab.com:39467/dessert"
//var databaseUrl = "localhost:27017/dessert"
var collections = ["users", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);


var app = express();

app.use(bodyParser());

app.get('/', function(req, res){
  res.send('hello world');
});

app.get('/users/list', users.list(db));
app.post('/users/add', users.add(db));
app.patch('/users/update/:id', users.patch(db));
app.delete('/users/delete/:id', users.delete(db));

app.listen(process.env.PORT || 3000, function(){
  console.log('Express server listening on port 3000');
});
