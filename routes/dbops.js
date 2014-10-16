var passport = require('../app').auth;
var Account = require('../models/account');
var Admin = require('../models/admin');
var Organization = require('../models/organization');
var Event = require('../models/events');
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

function addEventToOrganization(event, orgName, callback){
  Organization.findOne({ "name": orgName }, function (err, org) {
    if(org){
        Event.findOne({ "name": event.name }, function (err2, duplicateEvent){
          if(!duplicateEvent){
            console.log(event);
            var newEvent = new Event(event);
            console.log(newEvent);
            newEvent.save(function(err3){
              callback(err3);
            });
            callback(err2, event);
          } else {
            callback(err2, duplicateEvent);
          }
        });
    }
    else{
      callback(err, org);
    }
  });
}
