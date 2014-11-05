app = require('../app');
auth = require('./authenticate');
var passport = require('../app').auth;
var Account = require('../models/account');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');
var common = require('./common');
var dbop = require('./dbops');

app.use(function(req, res, next){
  common.errNotFound(req,res);
});

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

app.get('/confirmaccount', auth.confirmuser);

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

function getHome(type,req,res){
  var page;
  var partial;
  if(type!==""){
    page = type+'/index';
    partial =
    {
      header: 'common/header',
      footer: 'common/footer',
      scripts: 'common/scripts',
      suggestedSidebar: 'user/suggestedSidebar',
      sidebar: 'user/sidebarUser'
    };
  }
  else{
    partial =
    {
      header: 'common/header',
      footer: 'common/footer',
      scripts: 'common/scripts'
    };
    page = "index";
  }
  res.locals = req.session.user;
  res.render(
    page,
    {
      partials:partial
    }
  );
}

app.get('/', function(req, res) {
  if(req.session.user){
    if(req.session.user.role=="user"){
      getHome("user",req,res);
    }
    else if(req.session.user.role=="organization"){
      dashboard(req,res);
    }
    else if(req.session.user.role=="admin"){
      getHome("admin",req,res);
    }
    else{
        getHome("",req,res);
    }
  }else{
    getHome("",req,res);
  }
});

app.get('/profileuser', function(req, res) {
  if(req.session.user){
    res.locals= req.session.user;
    console.log(res.partials);
    res.status(200);
    if(req.session.user.role==="user" && (typeof req.query.username==="undefined")){
      res.render(
        'user/userprofile',
        {
          partials:
          {
            header: 'common/header',
            footer: 'common/footer',
            sidebar: 'user/sidebarUser',
            suggestedSidebar: 'user/suggestedSidebar',
            scripts: 'common/scripts'
          }
        }
      );
    }
    else if(req.session.user.role==="organization" && (typeof req.query.email!=="undefined")){
      //console.log(req.query.email);
      dbop.getUser(req.query.email,function(err,user){
        res.locals.user=user;
        res.render(
          'organization/userprofile',
          {
            partials:
            {
              header: 'common/header',
              footer: 'common/footer',
              sidebar: 'organization/sidebar',
              scripts: 'common/scripts'
            }
          }
        );
      });


    }
    else
      common.errNotFound(req,res);
  }else
      common.errNotFound(req,res);
});

app.get('/userhistory', function(req, res) {
  res.render(
    'user/history',
    {
      partials:
      {
        header: 'common/header',
        footer: 'common/footer',
        sidebar: 'user/sidebarUser',
        suggestedSidebar: 'user/suggestedSidebar',
        scripts: 'common/scripts'
      }
    }
  );
});

app.get('/configureuser', function(req, res) {
  if(req.session.user){
    res.locals= req.session.user;
    res.status(200);
    if(req.session.user.role==="user" && (typeof req.query.username==="undefined")){
      res.render(
        'user/configureuser',
        {
          partials:
          {
            header: 'common/header',
            footer: 'common/footer',
            sidebar: 'user/sidebarUser',
            suggestedSidebar: 'user/suggestedSidebar',
            scripts: 'common/scripts'
          }
        }
      );
    }
    else
      common.errNotFound(req,res);
  }else
    common.errNotFound(req,res);
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

function showOrg(page,req,res,org){
  dbop.getOrganization(org,function(err,organization){
    if(!err){
      var data= {};
      data.org=organization;
      res.locals=data;

      if(page=="organization"){
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
      }
      else if(page=="user"){
        res.render(
          'user/profileorg',
          {
            partials:
            {
              sidebar:'user/sidebarUser',
              header: 'common/header',
              footer: 'common/footer',
              scripts:'common/scripts'
            }
          }
        );
      }
    else{
      res.render(
        'visitor/profileorg',
        {
          partials:
          {
            header: 'common/header',
            footer: 'common/footer',
            scripts:'common/scripts'
          }
        });
     }
   }
  });
}

app.get('/profileorg', function(req,res,next){
  if(req.session.user && (typeof req.query.org!=="undefined")){
    if(req.session.user.role=="user" || (req.session.user.role=="admin")){
      showOrg("user",req,res,req.query.org);
    }
    else if(req.session.user.role=="organization"){
      showOrg("organization",req,res,req.query.org);
    }
    else{
      errPermissions(req,res);
      }
  }
  else if(typeof req.query.org!=="undefined"){
    showOrg("",req,res,req.query.org);
  }
  else
    common.errNotFound(req,res);

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

app.get('/events', function(req, res) {
  if(req.session.user){
    res.status(200);
    if(req.session.user.role==="organization"){
      dbop.getOrganizationEvents(req.session.user.email, function(err,data){
        if(!err){
          res.locals.events= data;
          res.render(
            'organization/myevents',
            {
              partials:
              {
                header: 'common/header',
                footer: 'common/footer',
                sidebar: 'organization/sidebar',
                scripts: 'common/scripts'
              }
            });
        }
      });

    } else
      common.errNotFound(req,res);
  } else
  common.errNotFound(req,res);
});


function dashboard(req, res) {
    res.render(
        'organization/dashboard',
        {
            partials:
            {
                header: 'common/header',
                sidebar:'organization/sidebar',
                events: 'organization/partialEvents',
                recruitment: 'organization/partialRecruitments',
                scripts:'common/scripts'
            }
        }
    );
}


//events
app.post('/newevent',function(req,res){
  //console.log(req.body.eventinfo);
  var temp = req.body.eventinfo;
  temp.org_email = req.session.user.email;
  console.log(req.session.user.email);
  dbop.addEventToOrganization(temp,req.body.email,function(err,events){
    console.log(err);
  });

});

//Edit user
app.post('/configuser',function(req,res){
  //console.log(req.body.eventinfo);
  console.log(req.body.account);
  var temp = req.body.account;

  temp.email = req.session.user.email;
  console.log(req.session.user.email);
  dbop.updateUserAccount(temp,req.body.email,function(err,data){
    console.log(err);
  });

});


app.get('/configureorg', function(req, res) {
  res.render(
    'organization/configureorg',
    {
      partials:
      {
        header: 'common/header',
        footer: 'common/footer',
        sidebar: 'organization/sidebar',
        scripts: 'common/scripts'
      }
    }
  );
});
