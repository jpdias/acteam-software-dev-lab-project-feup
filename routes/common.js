app = require('../app');
auth = require('./authenticate');
var passport = require('../app').auth;
var Account = require('../models/account');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');

function ErrPermissions(req,res){
  res.status(500);
  res.render(
    'errors/500',
    {
      partials:
      {
        header: 'common/header',
        footer: 'common/footer',
        scripts:'common/scripts',
      }
    }
  );
  return;
}
function ErrNotFound(req,res){
  res.status(404);
  res.render(
    'errors/404',
    {
      partials:
      {
        header: 'common/header',
        footer: 'common/footer',
        scripts:'common/scripts',
      }
    }
  );
  return;
}

module.exports.errPermission = ErrPermissions;
module.exports.errNotFound =  ErrNotFound;
