app = require('../app');
auth = require('./authenticate');
var passport = require('../app').auth;
var Account = require('../models/account');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');

function ErrPermissions(req,res){
  res.status(500);
  res.send({"Error":"Permission fault"});
  return;
}
function ErrNotFound(req,res){
  res.status(404);
  res.send({"Error":"Not Found"});
  return;
}

module.exports.errPermission = ErrPermissions;
module.exports.errNotFound =  ErrNotFound;
