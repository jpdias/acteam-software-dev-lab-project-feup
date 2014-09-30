var express = require('express');
var http = require('http');
var path = require('path');
var db = require('mongoose');

var app = module.exports = express();

db.connect('mongodb://acteam:acteamadmin@ds031088.mongolab.com:31088/acteam');

module.exports.mongodb = db;

app.set('port', process.env.PORT || '3000');
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hjs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes');

http.createServer(app).listen(app.get('port'), function(){
  console.log('\n----------------------\nNode.js server listening on port '+app.get('port'));
});
