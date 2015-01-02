var passport = require('../app').auth;
var Account = require('../models/account');
var Admin = require('../models/admin');
var Organization = require('../models/organization');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');
var common = require('./common');

function errorLogin(err, req, res) {
  console.log(err);
  error = {
    msg: err
  };
  res.locals = error;
  res.render(
    'signin', {
      partials: {
        header: 'common/header',
        footer: 'common/footer',
        scripts: 'common/scripts'
      }
    }
  );
}
module.exports.loginErrors = errorLogin;

function confirmaccount(req, res) {
  Account.findOne({
    email: req.query.email
  }, function(err, user) {
    if (user) {
      if (sha1(user.email + user.name) === req.query.code) {
        user.confirmed = true;
        user.save(function(err) {
          if (err) {
            errorLogin("Error with the account.", req, res);
            return next(err);
          } else {
            errorLogin("Account confirmed with success!", req, res);
          }
        });
      }
    } else {
      Organization.findOne({
        email: req.query.email
      }, function(err, user) {
        if (user) {
          if (sha1(user.email + user.name) === req.query.code) {
            user.confirmed = true;
            user.save(function(err) {
              if (err) {
                errorLogin("Error with the account.", req, res);
                return next(err);
              } else {
                errorLogin("Account confirmed with success!", req, res);
              }
            });
          }
        } else {
          errorLogin("Account doesn't exists!", req, res);
        }
      });
    }
  });


}

function register(req, res) {
  //  console.log(req.body.role);
  var hash, temp;
  if (req.body.role === "user") {
    hash = sha1(req.body.password);
    temp = req.body;
    temp.password = hash;
    var person = new Account(temp);
    person.save(function(error, data) {
      if (error) {
        res.json(error);
      } else {
        res.json(data);
      }
    });
  } else if (req.body.role === "organization") {
    hash = sha1(req.body.password);
    temp = req.body;
    temp.password = hash;
    var org = new Organization(temp);
    org.save(function(error, data) {
      if (error) {
        res.json(error);
      } else {
        res.json(data);
      }
    });
  }
  common.email(req.body.email, "Acteam Network", "Hello, Confirmation Link: http://" + req.headers.host + "/confirmaccount?code=" + sha1(req.body.email + req.body.name) + "&email=" + req.body.email + " Acteam Group");
}
passport.use(new LocalStrategy(
  function(username, password, done) {
    Account.findOne({
      email: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        Organization.findOne({
          email: username
        }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            Admin.findOne({
              email: username
            }, function(err, user) {
              if (err) {
                return done(err);
              }
              if (!user) {
                return done(null, false, {
                  message: 'Incorrect username.'
                });
              } else if (sha1(password) != user.password) {
                return done(null, false, {
                  message: 'Incorrect password.'
                });
              } else
                return done(null, user);
            });
          } else if (sha1(password) != user.password || user.confirmed === false || user.isOrgApproved === false) {
            return done(null, false, {
              message: 'Incorrect password.'
            });
          } else
            return done(null, user);
        });
      } else if (sha1(password) != user.password || user.confirmed === false) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      } else
        return done(null, user);
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  Account.findOne({
    email: user
  }, function(err, user) {
    done(err, user);
  });
});

module.exports.confirmuser = confirmaccount;
module.exports.reg = register;