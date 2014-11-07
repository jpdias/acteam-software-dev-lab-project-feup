var passport = require('../app').auth;
var Account = require('../models/account');
var Admin = require('../models/admin');
var Organization = require('../models/organization');
var Event = require('../models/events');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');
var mandrill = require('node-mandrill')('Kj-1SGPKFICoSgUIo9OEqw');
var fs = require('fs');

function getUser(userEmail, callback){
  Account.findOne({"email":userEmail},function(err, user){
    callback(err, user);
  });
}

module.exports.getUser = getUser;

function getOrg(orgname, callback){
  Organization.findOne({"name":orgname},function(err,org){
    callback(err, org);
  });
}

module.exports.getOrganization = getOrg;

function addNewMemberToOrg(member, orgName, callback){
    Organization.findOne({ "name": orgName }, function (err, org) {
      if(org){
        if(!org.members.hasOwnProperty(member.email)){
          org.members.push(member);
          org.save(function(err2){
            callback(err2, org);
          });
        }
      }
      else{
        callback(err, org);
      }
    });
}

module.exports.addNewMemberToOrganization = addNewMemberToOrg;

function rmMemberFromOrg(member, orgName, callback){
  Organization.findOne({ "name": orgName }, function (err, org) {
    if(org){
      var i = org.members.indexOf(member);
      if(i != 1){
        org.members.splice(i);
        org.save(function(err2){
          callback(err2, org);
        });
      }
    }
    else{
      callback(err, org);
    }
  });
}

module.exports.removeMemberFromOrganization = rmMemberFromOrg;

function getOrgEvents(orgEmail, callback){
  Event.find({"org_email":orgEmail},function(err,events){
    callback(err, events);
  });
}

module.exports.getOrganizationEvents = getOrgEvents;

function addEventToOrg(event, orgName, callback){
  Organization.findOne({ "email": orgName }, function (err, org) {
    //console.log(org);
    if(org){
        Event.findOne({ "name": event.name }, function (err2, duplicateEvent){
          if(!duplicateEvent){
            console.log(event);
            var newEvent = new Event(event);
            console.log(newEvent);
            newEvent.save(function(err3){
              callback(err3, event);
            });
            callback(err2, event);
          } else {
            callback(err2, event);
          }
        });
    }
    else{
      callback(err, org);
    }
  });
}

module.exports.addEventToOrganization = addEventToOrg;

function rmAcc(name, callback){
  Account.findOneAndRemove({"name":name}, function(err){
    callback(err);
  });
}

module.exports.removeAccount = rmAcc;

function updateUserAcc(dataupdate, email, callback){
  Account.findOne({ "email": email }, function (err, user) {
    if(user){
        Account.findOneAndUpdate({ "email": email }, dataupdate, {}, function(err, user) {
          if(err){
            callback(err, user);
          }
          else{
            callback(err, user);
          }
        });
    }
    else{
      callback(err, user);
    }
  });
}

module.exports.updateUserAccount = updateUserAcc;

function editOrgImages(images, orgName, callback){
  Organization.findOne({"name": orgName}, function(err, org){
    if(org){
      org.images.save(images,function(err){
        callback(err, org);
      });
    }
    else{
      callback(err, org);
    }
  });
}

module.exports.editOrgImages = editOrgImages;
