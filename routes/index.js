app = require('../app');
auth = require('./authenticate');
var passport = require('../app').auth;
var Account = require('../models/account');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');
var common = require('./common');
var dbop = require('./dbops');

app.use(function(req, res, next) {
  common.errNotFound(req, res);
});

app.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (!user) {
      if (info.message === 'Incorrect username.')
        return res.send({
          success: false,
          message: 'account'
        });
      else {
        return res.send({
          success: false,
          message: 'password'
        });
      }
    } else {
      req.session.user = user;
      return res.send({
        success: true,
        message: 'authentication succeeded'
      });
    }
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.post('/logout', function(req, res) {
  req.logout();
  req.session.destroy();
  return res.send({
    success: false
  });
});

app.post('/register', auth.reg);

app.get('/confirmaccount', auth.confirmuser);

app.get('/loggedIn', function(req, res) {
  if (req.session.user) {
    if (typeof req.session.user.role !== 'undefined') {
      res.send(req.session.user);
    } else
      res.send({
        "login": false
      });
  } else {
    res.send({
      "login": false
    });
  }
});

function getHome(type, req, res) {
  var page;
  var partial;
  if (type !== "") {
    page = type + '/index';
    partial = {
      header: 'common/header',
      footer: 'common/footer',
      scripts: 'common/scripts',
      suggestedSidebar: 'user/suggestedSidebar',
      sidebar: 'user/sidebarUser'
    };
  } else {
    partial = {
      header: 'common/header',
      footer: 'common/footer',
      scripts: 'common/scripts'
    };
    page = "index";
  }
  res.locals = req.session.user;
  res.render(
    page, {
      partials: partial
    }
  );
}

app.get('/', function(req, res) {
  if (req.session.user) {
    if (req.session.user.role == "user") {
      getHome("user", req, res);
    } else if (req.session.user.role == "organization") {
      dashboard(req, res);
    } else if (req.session.user.role == "admin") {
      getHome("admin", req, res);
    } else {
      getHome("", req, res);
    }
  } else {
    getHome("", req, res);
  }
});

app.get('/profileuser', function(req, res) {
  if (req.session.user) {
    res.locals = req.session.user;
    //console.log(res.partials);
    res.status(200);
    if (req.session.user.role === "user" && (typeof req.query.username === "undefined")) {
      res.render(
        'user/userprofile', {
          partials: {
            header: 'common/header',
            footer: 'common/footer',
            sidebar: 'user/sidebarUser',
            suggestedSidebar: 'user/suggestedSidebar',
            scripts: 'common/scripts'
          }
        }
      );
    } else if (req.session.user.role === "organization" && (typeof req.query.email !== "undefined")) {
      //console.log(req.query.email);
      dbop.getUser(req.query.email, function(err, user) {
        res.locals.user = user;

        res.render(
          'organization/userprofile', {
            partials: {
              header: 'common/header',
              footer: 'common/footer',
              sidebar: 'organization/sidebar',
              scripts: 'common/scripts'
            }
          });

      });


    } else
      common.errNotFound(req, res);
  } else
    common.errPermission(req, res);
});

app.get('/userhistory', function(req, res) {
  res.render(
    'user/history', {
      partials: {
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

  if (req.session.user) {
    res.locals = req.session.user;
    res.status(200);
    if (req.session.user.role === "user") {
      res.render(
        'user/configureuser', {
          partials: {
            header: 'common/header',
            footer: 'common/footer',
            sidebar: 'user/sidebarUser',
            suggestedSidebar: 'user/suggestedSidebar',
            scripts: 'common/scripts'
          }
        }
      );
    } else
      common.errNotFound(req, res);
  } else
    common.errNotFound(req, res);
});

app.get('/signin', function(req, res) {
  if (!req.session.user) {
    if (req.query.err) {
      if (req.query.err === "pw")
        res.locals = {
          msg: "Wrong password!"
        };
      else
        res.locals = {
          msg: "Invalid account!"
        };
    }
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
});

function showOrg(page, req, res, org) {
  dbop.getOrganization(org, function(err, organization) {
    if (!err) {
      var data = {};
      //console.log("Org name: " + org);
      data.org = organization;
      dbop.getOrganizationEvents(data.org.email, function(err, events) {
        data.events = events;
        data.user = req.session.user;
        res.locals = data;

        if (page == "organization") {
          res.render(
            'organization/profile', {
              partials: {
                sidebar: 'organization/sidebar',
                header: 'common/header',
                footer: 'common/footer',
                scripts: 'common/scripts'
              }
            }
          );
        } else if (page == "user") {
          res.render(
            'user/profileorg', {
              partials: {
                sidebar: 'user/sidebarUser',
                header: 'common/header',
                footer: 'common/footer',
                scripts: 'common/scripts'
              }
            }
          );
        } else {
          res.render(
            'visitor/profileorg', {
              partials: {
                header: 'common/header',
                footer: 'common/footer',
                scripts: 'common/scripts'
              }
            });
        }

      });
    }
  });
}

app.get('/profileorg', function(req, res, next) {
  if (req.session.user && (typeof req.query.org !== "undefined")) {
    if (req.session.user.role == "user" || (req.session.user.role == "admin")) {
      showOrg("user", req, res, req.query.org);
    } else if (req.session.user.role == "organization") {
      showOrg("organization", req, res, req.query.org);
    } else {
      errPermissions(req, res);
    }
  } else if (typeof req.query.org !== "undefined") {
    showOrg("", req, res, req.query.org);
  } else
    common.errNotFound(req, res);

});

app.get('/registerorg', function(req, res) {
  res.render(
    'organization/register', {
      partials: {
        header: 'common/header',
        footer: 'common/footer',
        scripts: 'common/scripts'
      }
    }
  );
});

app.get('/events', function(req, res) {
  if (req.session.user) {
    res.status(200);
    if (req.session.user.role === "organization") {
      dbop.getOrganizationEvents(req.session.user.email, function(err, data) {
        if (!err) {
          res.locals.events = data;
          res.locals.org = req.session.user;
          res.render(
            'organization/myevents', {
              partials: {
                header: 'common/header',
                footer: 'common/footer',
                sidebar: 'organization/sidebar',
                scripts: 'common/scripts'
              }
            });
        }
      });

    } else
      common.errNotFound(req, res);
  } else
    common.errNotFound(req, res);
});


app.post('/eventapply', function(req, res) {
  //console.log(req.body.name + req.body.org_email + req.body.user_email);
  dbop.setApplyEvent(req.body.name, req.body.org_email, req.body.user_email, function(err, event) {
    if (!err) {
      res.send({
        success: true
      });
    } else
      res.send({
        success: false
      });
  });
});


function dashboard(req, res) {
  if (req.session.user) {
    res.status(200);
    res.locals.org = req.session.user;
    if (req.session.user.role === "organization") {
      res.render(
        'organization/dashboard', {
          partials: {
            header: 'common/header',
            sidebar: 'organization/sidebar',
            events: 'organization/partialEvents',
            recruitment: 'organization/partialRecruitments',
            scripts: 'common/scripts'
          }
        }
      );
    }
  }
}


//events
app.post('/newevent', function(req, res) {
  //console.log(req.body.eventinfo);
  var temp = req.body.eventinfo;
  temp.org_email = req.session.user.email;
  console.log(req.session.user.email);
  dbop.addEventToOrganization(temp, temp.org_email, function(err, events) {
    if (err) {
      return res.send({
        success: false,
        message: 'error when adding a new event'
      });
    } else {
      return res.send({
        success: true,
        message: 'successfully added a new event'
      });
    }
  });

});

//Edit user
app.post('/configuser', function(req, res) {
  //console.log(req.body.eventinfo);
  if (req.session.user) {
    var temp = req.body.account;
    temp.email = req.session.user.email;
    dbop.updateUserAccount(temp, req.session.user.email, function(err, data) {
      if (err) {
        return res.send({
          success: false,
          message: 'error when updating user profile'
        });
      } else {
        req.session.user = data;
        req.session.save(function(err) {
          if (err) {
            return res.send({
              success: false,
              message: 'error when saving session after updating user profile'
            });
          } else {
            return res.send({
              success: true,
              message: 'sucess'
            });
          }
        });

      }
    });
  } else
    common.errPermissions(req, res);
});

app.post('/configorg', function(req, res) {
  //console.log(req.body.account);
  if (req.session.user) {
    var temp = req.body.account;
    temp.email = req.session.user.email;
    dbop.updateOrganizationAccount(temp, req.session.user.email, function(err, data) {
      if (err) {
        return res.send({
          success: false,
          message: 'error when updating organization profile'
        });
      } else {
        req.session.user = data;
        req.session.save(function(err) {
          if (err) {
            return res.send({
              success: false,
              message: 'error when saving session after updating organization profile'
            });
          }
        });
      }
    });
    return res.send({
      success: true,
      message: 'successful organization profile update'
    });
  }
});

app.get('/configureorg', function(req, res) {
  if (req.session.user) {
    if (req.session.user.role == "organization") {
      dbop.getOrganization(req.session.user.name, function(err, organization) {
        if (!err) {
          var data = {};
          //console.log("Org name: " + org);
          data.org = organization;
          res.locals = data;
          res.render(
            'organization/configureorg', {
              partials: {
                header: 'common/header',
                footer: 'common/footer',
                sidebar: 'organization/sidebar',
                scripts: 'common/scripts'
              }
            }
          );
        }
      });
    }
  } else
    common.errPermission(req, res);
});

app.get('/recovery', function(req, res) {
  if (!req.session.user && (typeof req.query.email !== "undefined") && (typeof req.query.code !== "undefined")) {
    res.render(
      'generic/recoveryPage', {
        partials: {
          header: 'common/header',
          footer: 'common/footer',
          scripts: 'common/scripts'
        }
      }
    );
  } else if (!req.session.user) {
    res.render(
      'generic/recoveryPassword', {
        partials: {
          header: 'common/header',
          footer: 'common/footer',
          scripts: 'common/scripts'
        }
      }
    );
  }

});

app.post('/recovery', function(req, res) {
  dbop.recoveryPassword(req.body.email, function(err) {
    if (err) {
      return res.send({
        success: false,
        message: 'teste'
      });
    } else {
      return res.send({
        success: true,
        message: 'teste'
      });
    }
  });
});


app.post('/resetpassword', function(req, res) {
  dbop.resetpassword(req.body.password, req.body.email, req.body.code, function(err) {
    if (err) {
      return res.send({
        success: false,
        message: 'teste'
      });
    } else {
      return res.send({
        success: true,
        message: 'teste'
      });
    }
  });
});

app.post('/deleteuser', function(req, res) {
  if (req.session.user) {
    dbop.deleteacc(req.session.user, function(err) {
      //req.logout();
      //req.session.destroy();
      //console.log("!");
      if (err) {
        return res.send({
          success: false
        });
      } else {
        return res.send({
          success: true
        });
      }
    });

  }
});

app.post('/userexists', function(req, res) {
  dbop.findUser(req.body.email, function(err, exists) {
    if (exists) {
      return res.send({
        valid: true
      });
    } else {
      return res.send({
        valid: false
      });
    }
  });
});

app.post('/checkevent', function(req, res) {
  dbop.checkEventExists(req.body.name, function(err, exists) {
    if (exists) {
      return res.send({
        valid: true
      });
    } else {
      return res.send({
        valid: false
      });
    }
  });
});

app.post('/usernotexists', function(req, res) {
  dbop.findUser(req.body.email, function(err, exists) {
    if (exists) {
      return res.send({
        valid: false
      });
    } else {
      return res.send({
        valid: true
      });
    }
  });
});

app.get('/searchorg', function(req, res) {

  if (req.session.user.role == "user") {
    res.locals.user = req.session.user;
    res.render('user/search', {
      partials: {
        header: 'common/header',
        sidebar: 'user/sidebarUser',
        suggestedSidebar: 'user/suggestedSidebar',
        footer: 'common/footer',
        scripts: 'common/scripts',
        searchorg: 'common/searchorg'
      }
    });
  } else if (req.session.user.role == "organization") {
    res.locals.org = req.session.user;
    res.render('organization/search', {
      partials: {
        header: 'common/header',
        sidebar: 'organization/sidebar',
        footer: 'common/footer',
        scripts: 'common/scripts',
        searchorg: 'common/searchorg'
      }
    });

  } else {
    res.render('visitor/search', {
      partials: {
        header: 'common/header',
        footer: 'common/footer',
        scripts: 'common/scripts',
        searchorg: 'common/searchorg'
      }
    });
  }
});

app.post('/searchorg', function(req, res) {
  if (req.session.user) {

    data = {};
    if (req.body.name)
      data.name = new RegExp(".*" + req.body.name + ".*", 'i');
    if (req.body.cause)
      data.causes = req.body.cause;
    if (req.body.location === "Municipality") {
      data.address = {};
      data.address.municipality = req.session.user.address.municipality;
    } else if (req.body.location === "District") {
      data.address = {};
      data.address.district = req.session.user.address.district;
    }

    dbop.searchOrganization(data, function(err, result) {
      if (err)
        res.send({
          "status": "error"
        });
      else
        res.send(result);
    });
  }
});