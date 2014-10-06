// passport config
var passport = require('../app').auth;
var Account = require('../models/account');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');

/*passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
*/
function register(req, res) {
  var hash = sha1(req.body.password);
  var temp = req.body;
  temp.password=hash;
  var person = new Account(temp);
  person.save( function(error, data){
    if(error){
        res.json(error);
    }
    else{
        res.json(data);
    }
  });
}

module.exports.reg = register;

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});
