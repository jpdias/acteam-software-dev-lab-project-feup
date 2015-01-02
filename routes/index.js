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
  if (type === "user") {
    dbop.getEventsDistrict(req.session.user.address.district, function(err, eventdata) {
      page = 'user/index';
      partial = {
        header: 'common/header',
        footer: 'common/footer',
        scripts: 'common/scripts',
        suggestedSidebar: 'user/suggestedSidebar',
        sidebar: 'user/sidebarUser',
      };
      res.locals = req.session.user;
      res.locals.events = eventdata;
      dbop.getPromo(function(err, data) {
        res.locals.suggested = data;
        res.render(
          page, {
            partials: partial
          }
        );
      });
    });
  } else if (type !== "") {
    page = type + '/index';

    partial = {
      header: 'common/header',
      footer: 'common/footer',
      scripts: 'common/scripts',
      suggestedSidebar: 'user/suggestedSidebar',
      sidebar: 'user/sidebarUser'
    };
    res.locals = req.session.user;
    res.render(
      page, {
        partials: partial
      }
    );
  } else {
    partial = {
      header: 'common/header',
      footer: 'common/footer',
      scripts: 'common/scripts'
    };
    page = "index";
    res.locals = req.session.user;
    res.render(
      page, {
        partials: partial
      }
    );
  }

}

app.get('/', function(req, res) {
  if (req.session.user) {
    if (req.session.user.role == "user") {

      getHome("user", req, res);

    } else if (req.session.user.role == "organization") {
      dashboard(req, res);
    } else
    if (req.session.user.role == "admin") {
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
      dbop.getPromotedOrgs(function(err, data) {
        res.locals.suggested = data;
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
      });

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
  if (req.session.user) {
    res.locals = req.session.user;

    res.status(200);
    if (req.session.user.role === "user") {
      dbop.getPromo(function(err, data) {
        res.locals.suggested = data;
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

    } else
      common.errNotFound(req, res);
  } else
    common.errPermission(req, res);
});

app.get('/configureuser', function(req, res) {
  if (req.session.user) {
    res.locals = req.session.user;
    res.status(200);

    if (req.session.user.role === "user") {
      dbop.getPromo(function(err, data) {
        res.locals.suggested = data;
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
      });

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
          msg: "Error with the account."
        };
      else
        res.locals = {
          msg: "Invalid account!"
        };
    }
    res.status(200);
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

        res.status(200);
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
    res.status(200);
    if (req.session.user.role == "user" || (req.session.user.role == "admin")) {
      showOrg("user", req, res, req.query.org);
    } else if (req.session.user.role == "organization") {
      showOrg("organization", req, res, req.query.org);
    } else {
      errPermissions(req, res);
    }
  } else if (typeof req.query.org !== "undefined") {
    res.status(200);
    showOrg("", req, res, req.query.org);
  } else {
    common.errNotFound(req, res);
  }

});

app.get('/registerorg', function(req, res) {
  res.status(200);
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
            'organization/events', {
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
    dbop.getOrganizationEvents(req.session.user.email, function(err, events) {
      res.locals.events = events;
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
    });
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

app.post('/userevents', function(req, res) {
  dbop.getUserEvents(req.body.userEmail, function(err, events) {
    if (err) {
      return res.send({
        error: true
      });
    } else {
      return res.send(events);
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
  if (req.session.user) {
    if (req.session.user.role == "user") {
      res.locals.user = req.session.user;
      res.render('user/searchorg', {
        partials: {
          header: 'common/header',
          sidebar: 'user/sidebarUser',
          suggestedSidebar: 'user/suggestedSidebar',
          footer: 'common/footer',
          scripts: 'common/scripts',
          searchorg: 'common/searchOrganizations'
        }
      });
    } else if (req.session.user.role == "organization") {
      res.locals.org = req.session.user;
      res.render('organization/searchorg', {
        partials: {
          header: 'common/header',
          sidebar: 'organization/sidebar',
          footer: 'common/footer',
          scripts: 'common/scripts',
          searchorg: 'common/searchOrganizations'
        }
      });
    } else {
      common.errPermission(req, res);
    }

  } else {
    common.errPermission(req, res);
  }
});

app.post('/searchorg', function(req, res) {
  if (req.session.user) {

    data = {};
    if (req.body.location === "Municipality") {
      data = {
        'address.municipality': req.session.user.address.municipality
      };
    } else if (req.body.location === "District") {
      data = {
        'address.district': req.session.user.address.district
      };
    }
    if (req.body.name)
      data.name = new RegExp(".*" + req.body.name + ".*", 'i');
    if (req.body.cause)
      data.causes = req.body.cause;

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

app.get('/searchuser', function(req, res) {
  if (req.session.user) {
    if (req.session.user.role == "organization") {
      res.locals.org = req.session.user;
      res.render('organization/searchuser', {
        partials: {
          header: 'common/header',
          sidebar: 'organization/sidebar',
          footer: 'common/footer',
          scripts: 'common/scripts',
          searchorg: 'common/searchUsers'
        }
      });
    } else {
      common.errPermission(req, res);
    }
  } else {
    common.errPermission(req, res);
  }
});

app.post('/searchuser', function(req, res) {
  if (req.session.user) {

    data = {};
    if (req.body.location === "Municipality") {
      data = {
        'address.municipality': req.session.user.address.municipality
      };
    } else if (req.body.location === "District") {
      data = {
        'address.district': req.session.user.address.district
      };
    }
    if (req.body.name)
      data.name = new RegExp(".*" + req.body.name + ".*", 'i');
    if (req.body.cause)
      data.causes = req.body.cause;


    dbop.searchUser(data, function(err, result) {
      if (err)
        res.send({
          "status": "error"
        });
      else
        res.send(result);
    });
  }
});

app.post('/approveOrgAcc', function(req, res) {
  if (req.session.user.role == "admin") {
    console.log(req.body);
    decision = req.body;
    dbop.approveOrgAcc(decision, function(err, result) {
      if (err)
        res.send({
          "status": "error"
        });
      else
        res.send({
          "status": "success"
        });
    });
  }
});

app.get('/getOrgAccByApprove', function(req, res) {
  if (req.session.user) {
    data = {};
    data.isOrgApproved = false;
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

app.post('/deleteOrgAcc', function(req, res) {
  if (req.session.user.role == "admin") {
    console.log(req.body);
    decision = req.body;
    dbop.deleteOrgAcc(decision, function(err, result) {
      if (err)
        res.send({
          "status": "error"
        });
      else
        res.send({
          "status": "success"
        });
    });
  }
});

app.get('/recruitment', function(req, res) {
  if (req.session.user.role === "organization") {
    res.locals.org = req.session.user;
    res.render('organization/recruitment', {
      partials: {
        header: 'common/header',
        sidebar: 'organization/sidebar',
        footer: 'common/footer',
        scripts: 'common/scripts'
      }
    });
  } else
    common.errNotFound(req, res);
});

app.post('/recruitmentstage', function(req, res) {
  if (req.session.user.role === "organization") {
    if (req.body.action === "start") {
      dbop.changeRecruit(req.session.user, function(err, result) {
        if (err)
          res.send({
            "status": "error"
          });
        else {
          req.session.user.recruitment.status = !req.session.user.recruitment.status;
          req.session.save(function(err) {});
          res.send({
            "action": 'started'
          });
        }
      });
    } else if (req.body.action === "end") {
      dbop.changeRecruit(req.session.user, function(err, result) {
        if (err)
          res.send({
            "status": "error"
          });
        else {
          req.session.user.recruitment.status = !req.session.user.recruitment.status;
          req.session.save(function(err) {});
          res.send({
            "action": 'started'
          });
        }
      });
      res.send({
        'action': 'end'
      });
    } else {
      res.send();
    }
  } else
    common.errPermission(req, res);
});

app.post('/recruitmentApply', function(req, res) {
  if (req.session.user.role === "user") {
    data = {};
    data.letter = req.body.motivation;
    data.email = req.session.user.email;
    dbop.addNewMemberRecruit(req.body.org_email, data, function(err, data) {
      if (err)
        res.send({
          "success": "false"
        });
      else {

        res.send({
          "success": 'true'
        });
      }
    });
  } else
    common.errPermission(req, res);
});

app.post('/recruitmentAction', function(req, res) {
  var data = req.body;
  data.org = req.session.user.email;
  dbop.memberRegestration(data, function(err, data) {
    if (err)
      res.send({
        "success": "false"
      });
    else {
      dbop.getOrganization(req.session.user.name, function(err, org) {
        req.session.user = org;
        req.session.save(function(err) {});
      });
      res.send({
        "success": 'true'
      });

    }
  });
});

app.get('/members', function(req, res) {
  if (req.session.user) {
    if (req.session.user.role == "organization") {
      res.locals.org = req.session.user;
      res.render('organization/members', {
        partials: {
          header: 'common/header',
          sidebar: 'organization/sidebar',
          footer: 'common/footer',
          scripts: 'common/scripts'
        }
      });
    } else
      common.errPermission(req, res);
  } else
    common.errPermission(req, res);
});

app.post("/deleteMember", function(req, res) {
  if (req.session.user) {
    if (req.session.user.role === "organization") {
      data = {};
      data.email = req.session.user.email;
      data.remove_email = req.body.email;

      dbop.removeMemberFromOrganization(data, function(err, data) {
        if (err)
          res.send({
            "success": "false"
          });
        else {
          dbop.getOrganization(req.session.user.name, function(err, org) {
            req.session.user = org;
            req.session.save(function(err) {

            });
            res.send({
              "success": 'true'
            });
          });
        }
      });
    } else
      common.errPermission(req, res);
  } else
    common.errPermission(req, res);
});

app.get("/promote", function(req, res) {
  if (req.session.user) {
    if (req.session.user.role === "organization") {
      res.locals.org = req.session.user;
      res.render('organization/promote', {
        partials: {
          header: 'common/header',
          sidebar: 'organization/sidebar',
          footer: 'common/footer',
          scripts: 'common/scripts'
        }
      });

    } else
      common.errPermission(req, res);
  } else
    common.errPermission(req, res);
});

app.post("/promote", function(req, res) {
  if (req.session.user) {
    if (req.session.user.role === "organization") {
      var data = {};
      data.date = req.body;
      data.org_name = req.session.user.name;
      data.org_email = req.session.user.email;
      dbop.addPromo(data, function(err) {
        if (err)
          res.send({
            "success": "false"
          });
        else {
          res.send({
            "success": 'true'
          });
        }
      });
    }
  }
});

app.get("/ispromoted", function(req, res) {
  if (req.session.user) {
    if (req.session.user.role === "organization") {
      dbop.ifOrganizationIsPromoted(req.session.user.email, function(err, isPromoted) {
        if (err) {
          res.send({
            "success": "false"
          });
        } else {
          if (isPromoted) {
            console.log("True, Is Promoted");
            res.send({
              "success": "true"
            });
          } else {
            console.log("False, Is Not Promoted");
            res.send({
              "success": "false"
            });
          }
        }
      });
    }
  }
});

app.get("/promoreq", function(req, res) {
  if (req.session.user) {
    if (req.session.user.role === "admin") {
      dbop.getPromoReq(function(err, data) {
        if (err)
          res.send({
            "success": "false"
          });
        else {
          res.send(data);
        }
      });
    }
  }
});

app.post("/setpromostatus", function(req, res) {
  if (req.session.user) {
    if (req.session.user.role === "admin") {
      dbop.setpromo(req.body, function(err, data) {
        if (err)
          res.send({
            "success": "false"
          });
        else {
          res.send(data);
        }
      });
    }
  }
});

app.post('/eventapplystatus', function(req, res) {
  if (req.session.user) {
    if (req.session.user.role === "organization") {
      //  console.log(req.body);
      dbop.setEvApply(req.body.name, req.body.email, req.body.check, function(err, data) {
        if (err)
          res.send({
            "success": "false"
          });
        else
          res.send({
            "success": "true"
          });
      });
    }
  }
});