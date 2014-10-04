var express = require('express');
var http = require('http');
var path = require('path');
var db = require('mongoose');
var hoganexpress = require('hogan-express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = module.exports = express();

db.connect('mongodb://acteam:acteamadmin@ds031088.mongolab.com:31088/acteam');

module.exports.mongodb = db;
module.exports.auth = passport;
module.exports.localStr = LocalStrategy;
app.engine('html', hoganexpress);
app.enable('view cache');

app.set('port', process.env.PORT || '3000');
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'html');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));


app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes');

http.createServer(app).listen(app.get('port'), function(){
  console.log('\n----------------------\nNode.js server listening on port '+app.get('port'));
});
