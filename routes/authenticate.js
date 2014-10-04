// passport config
var passport = require('../app').auth;
var Account = require('../models/account');
var LocalStrategy = require('../app').localStr;

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
          return res.render('register', { account : account });
      }

      passport.authenticate('local')(req, res, function () {
        res.redirect('/');
      });
  });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});
