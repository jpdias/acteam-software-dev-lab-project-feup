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
    if(typeof req.session.user.role!=='undefined'){
      res.send(req.session.user);}
    else
      res.send({"login":false});
  } else {
    res.send({"login":false});
  }
});

app.get('/', function(req, res) {
  if(req.session.user){
    if(req.session.user.role=="user"){
      res.locals = req.session.user;
      res.render(
        'user/index',
        {
          partials:
          {
            header: 'common/header',
            footer: 'common/footer',
            sidebar: 'user/sidebarUser',
            scripts: 'common/scripts'
          }
        }
      );
    }
    else if(req.session.user.role=="organization"){
      res.locals = req.session.user;
      res.render(
        'organization/index',
        {
          partials:
          {
            header: 'common/header',
            footer: 'common/footer',
            scripts: 'common/scripts'
          }
        }
      );
    }
    else if(req.session.user.role=="admin"){
      res.locals = req.session.user;
      res.render(
        'admin/index',
        {
          partials:
          {
            header: 'common/header',
            footer: 'common/footer',
            scripts: 'common/scripts'
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
            header: 'common/header',
            footer: 'common/footer',
            scripts: 'common/scripts'
          }
        }
      );
    }
  }else{
    res.render(
      'index',
      {
        partials:
        {
          header: 'common/header',
          footer: 'common/footer',
          scripts: 'common/scripts'
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
        header: 'common/header',
        footer: 'common/footer',
        scripts: 'common/scripts'
      }
    }
  );
});
app.get('/profileorg', function(req,res){
  res.render(
    'organization/profile',
    {
      partials:
      {
        sidebar:'organization/sidebar',
        header: 'common/header',
        footer: 'common/footer',
        scripts:'common/scripts'
      }
    }
  );
});

app.get('/registerorg', function(req, res) {
  res.render(
    'organization/register',
    {
      partials:
      {
        header: 'common/header',
        footer: 'common/footer',
        scripts:'common/scripts'
      }
    }
  );
});
