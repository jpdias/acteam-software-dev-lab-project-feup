var passport = require('../app').auth;
var Account = require('../models/account');
var Admin = require('../models/admin');
var Organization = require('../models/organization');
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
