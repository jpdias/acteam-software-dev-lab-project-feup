app = require('../app');
auth = require('./authenticate');
var passport = require('../app').auth;
var Account = require('../models/account');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');
var mandrill = require('node-mandrill')('Kj-1SGPKFICoSgUIo9OEqw');

function ErrPermissions(req, res) {
  res.status(500);
  res.render(
    'errors/500', {
      partials: {
        header: 'common/header',
        footer: 'common/footer',
        scripts: 'common/scripts',
      }
    }
  );
  return;
}

function ErrNotFound(req, res) {
  res.status(404);
  res.render(
    'errors/404', {
      partials: {
        header: 'common/header',
        footer: 'common/footer',
        scripts: 'common/scripts',
      }
    }
  );
  return;
}

function ErrServiceUnavailable(req, res) {
  res.status(503);
  res.render(
    'errors/503', {
      partials: {
        footer: 'common/footer',
        scripts: 'common/scripts',
      }
    }
  );
  return;
}

module.exports.errPermission = ErrPermissions;
module.exports.errNotFound = ErrNotFound;

function sendMail(who, title, msg) {
  mandrill('/messages/send', {
    message: {
      to: [{
        email: who,
        name: "Acteam Member"
      }],
      from_email: "no-reply@acteam.com",
      subject: title,
      text: msg
    }
  }, function(error, response) { //uh oh, there was an error
    if (error) console.log(JSON.stringify(error));
    //everything's good, lets see what mandrill said
    else console.log(response);
  });
}

module.exports.email = sendMail;