var express = require('express');
var http = require('http');
var path = require('path');
var db = require('mongoose');
var hoganexpress = require('hogan-express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var methodOverride = require('method-override');

var app = module.exports = express();
var logger = require("morgan");

app.engine('html', hoganexpress);
app.enable('view cache');

app.set('port', process.env.PORT || '80');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.urlencoded());
app.use(express.json());

app.use(express.urlencoded());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({
  secret: 'anything'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use(app.router);

try {
  db.createConnection('mongodb://acteam:acteamadmin@ds031088.mongolab.com:31088/acteam');
} catch (ex) {
  app.get('/', function(req, res) {
    res.render('errors/503');
  });
}

db.connect('mongodb://acteam:acteamadmin@ds031088.mongolab.com:31088/acteam');

module.exports.mongodb = db;
module.exports.auth = passport;
module.exports.localStr = LocalStrategy;

require('./routes');



http.createServer(app).listen(app.get('port'), function() {
  console.log('\n----------------------\nNode.js server listening on port ' + app.get('port'));
});