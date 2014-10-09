var passport = require('../app').auth;
var Account = require('../models/account');
var Admin = require('../models/admin');
var Organization = require('../models/organization');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');

/*passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
*/
function register(req, res) {
  console.log(req.body.role);
  var hash,temp;
  if(req.body.role==="user"){
    hash = sha1(req.body.password);
    temp = req.body;
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
  else if(req.body.role==="organization"){
    hash = sha1(req.body.password);
    temp = req.body;
    temp.password=hash;
    var org = new Organization(temp);
    org.save( function(error, data){
      if(error){
          res.json(error);
      }
      else{
          res.json(data);
      }
    });
  }
}
passport.use(new LocalStrategy(
  function(username, password, done) {
    if(Account.findOne({ email: username }).limit(1)!==null){
      Account.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (sha1(password)!=user.password ) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
    else if(Organization.findOne({ email: username }).limit(1)!==null){
      Organization.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (sha1(password)!=user.password ) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
    else {
      Admin.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (sha1(password)!=user.password ) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  Account.findOne({ email: user }, function(err, user) {
    done(err, user);
  });
});

module.exports.reg = register;
