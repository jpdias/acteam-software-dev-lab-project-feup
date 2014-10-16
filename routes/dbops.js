var passport = require('../app').auth;
var Account = require('../models/account');
var Admin = require('../models/admin');
var Organization = require('../models/organization');
var Event = require('../models/event');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');
var mandrill = require('node-mandrill')('Kj-1SGPKFICoSgUIo9OEqw');
var fs = require('fs');

function getOrg(orgname, callback){
  Organization.findOne({"name":orgname},function(err,org){
    callback(err, org);
  });
}

module.exports.getOrganization = getOrg;

function getOrgEvents(orgEmail, callback){
  Event.find({"org_email":orgEmail},function(err,events){
    callback(err, events);
  });
}

module.exports.getOrganizationEvents = getOrgEvents;

function getUser(userName, callback){
  Account.find({"name":userName},function(err, user){
    callback(err, user);
  });
}

module.exports.getUser = getUser;

/*
Organization.findOne({ email: req.query.email }, function (err, user) {
  if(user){
    if(sha1(user.email+user.name)===req.query.code){
      user.confirmed = true;
      user.save(function(err) {
        if (err) {
          errorLogin("Error with the account.",req,res);
          return next(err);
        }
        else{
          errorLogin("Account confirmed with success!",req,res);
        }
      });
    }
  }
  else{
    errorLogin("Account doesn't exists!",req,res);
  }
});
*/
