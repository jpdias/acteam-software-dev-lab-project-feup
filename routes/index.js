app = require('../app');
auth = require('./authenticate');
var passport = require('../app').auth;
var Account = require('../models/account');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');

//Error handling !
app.use(function(req, res, next){
  res.status(404);
  res.send({ error: 'Not found' });
  return;
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.send({ error: err.message });
  return;
});
//End of error handling

//auth
/*app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/signin' }));*/
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : true, message : 'authentication succeeded' });
    }
    req.session.user = user;
    return res.send({ success : true, message : 'authentication succeeded' });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.post('/register',auth.reg);

app.get('/loggedIn', function(req, res) {
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    res.send({"login":false});
  }
});

app.get('/', function(req, res) {
  if(req.session.user){
    res.locals = req.session.user;
    res.render(
      'home',
      {
        partials:
        {
          header: 'header',
          footer: 'footer',
          scripts: 'scripts'
        }
      }
    );
  }
  else{
    res.render(
      'index',
      {
        partials:
        {
          header: 'header',
          footer: 'footer',
          scripts: 'scripts'
        }
      }
    );
  }

});

app.get('/signin', function(req, res) {
  res.render(
    'signin',
    {
      partials:
      {
        header: 'header',
        footer: 'footer',
        scripts: 'scripts'
      }
    }
  );
});
