var express = require('express');
var http = require('http');
var path = require('path');

var app = module.exports = express();


app.set('port', process.env.PORT || '3000');
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
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
