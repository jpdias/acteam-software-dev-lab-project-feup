var passport = require('../app').auth;
var Account = require('../models/account');
var Admin = require('../models/admin');
var Organization = require('../models/organization');
var Event = require('../models/events');
var LocalStrategy = require('../app').localStr;
var sha1 = require('sha1');
var mandrill = require('node-mandrill')('Kj-1SGPKFICoSgUIo9OEqw');
var fs = require('fs');
var common = require('./common');

function getUser(userEmail, callback) {
  Account.findOne({
    "email": userEmail
  }, function(err, user) {
    callback(err, user);
  });
}

module.exports.getUser = getUser;

function searchUsr(data, callback) {
  Account.find(
    data,
    function(err, data) {
      console.log(data);
      callback(err, data);
    });
}

module.exports.searchUser = searchUsr;

function getOrg(orgname, callback) {
  Organization.findOne({
    "name": orgname
  }, function(err, org) {
    callback(err, org);
  });
}

module.exports.getOrganization = getOrg;


function searchOrg(data, callback) {
  Organization.find(
    data,
    function(err, data) {
      callback(err, data);
    });
}

module.exports.searchOrganization = searchOrg;

function addNewMemberToOrg(member, orgName, callback) {
  Organization.findOne({
    "name": orgName
  }, function(err, org) {
    if (org) {
      if (!org.members.hasOwnProperty(member.email)) {
        org.members.push(member);
        org.save(function(err2) {
          callback(err2, org);
        });
      }
    } else {
      callback(err, org);
    }
  });
}

module.exports.addNewMemberToOrganization = addNewMemberToOrg;

function rmMemberFromOrg(member, orgName, callback) {
  Organization.findOne({
    "name": orgName
  }, function(err, org) {
    if (org) {
      var i = org.members.indexOf(member);
      if (i != 1) {
        org.members.splice(i);
        org.save(function(err2) {
          callback(err2, org);
        });
      }
    } else {
      callback(err, org);
    }
  });
}

module.exports.removeMemberFromOrganization = rmMemberFromOrg;

function getOrgEvents(orgEmail, callback) {
  var currentTime = new Date();
  Event.find({
    "org_email": orgEmail,
    "date.end": {
      $gt: currentTime
    }
  }, function(err, events) {
    callback(err, events);
  });
}

module.exports.getOrganizationEvents = getOrgEvents;

function getOrgEventsByDistrict(district, callback) {
  var currentTime = new Date();
  Event.find({
    "address.district": district,
    "date.end": {
      $gt: currentTime
    }
  }, function(err, events) {
    callback(err, events);
  });
}

module.exports.getEventsDistrict = getOrgEventsByDistrict;

function applyToEvent(name, orgEmail, userEmail, callback) {
  Event.findOne({
    "org_email": orgEmail,
    "name": name
  }, function(err, events) {
    //console.log(userEmail);
    events.people.push({
      email: userEmail,
      status: false
    });
    //console.log(events);
    events.save(function(err) {
      callback(err, events);
    });
  });
}

module.exports.setApplyEvent = applyToEvent;

function addEventToOrg(event, orgName, callback) {
  Organization.findOne({
    "email": orgName
  }, function(err, org) {
    var newEvent = new Event(event);
    //console.log(newEvent);
    newEvent.save(function(err) {
      if (err) {
        console.log("FAIL");
        console.log(err);
        callback(err, event);
      } else {
        console.log("Success");
        callback(err, event);
      }
    });
  });
}

module.exports.addEventToOrganization = addEventToOrg;

function rmAcc(name, callback) {
  Account.findOneAndRemove({
    "name": name
  }, function(err) {
    callback(err);
  });
}

module.exports.removeAccount = rmAcc;

function updateUserAcc(dataupdate, email, callback) {
  Account.findOne({
    "email": email
  }, function(err, user) {
    if (user) {
      Account.findOneAndUpdate({
        "email": email
      }, dataupdate, {}, function(err, user) {
        if (err) {
          callback(err, user);
        } else {
          callback(err, user);
        }
      });
    } else {
      callback(err, user);
    }
  });
}

module.exports.updateUserAccount = updateUserAcc;

function updateOrgAcc(dataupdate, email, callback) {
  Organization.findOne({
    "email": email
  }, function(err, user) {
    if (user) {
      Organization.findOneAndUpdate({
        "email": email
      }, dataupdate, {}, function(err, user) {
        if (err) {
          callback(err, user);
        } else {
          callback(err, user);
        }
      });
    } else {
      callback(err, user);
    }
  });
}

module.exports.updateOrganizationAccount = updateOrgAcc;

function editOrgImages(images, orgName, callback) {
  Organization.findOne({
    "name": orgName
  }, function(err, org) {
    if (org) {
      org.images.save(images, function(err) {
        callback(err, org);
      });
    } else {
      callback(err, org);
    }
  });
}

module.exports.editOrgImages = editOrgImages;

function recoveryPass(email, callback) {
  Organization.findOne({
    "email": email
  }, function(err, user) {
    if (!err && user)
      common.email(email, "Acteam Network", "Hello, Recovery Password Link: http://localhost:3000/recoverypassword?code=" + sha1(user.name + user.password) + "&email=" + user.email + " Acteam Group");
    else
      callback(err);
  });
  Account.findOne({
    "email": email
  }, function(err, user) {
    if (!err && user)
      common.email(email, "Acteam Network", "Hello, Recovery Password Link: http://localhost:3000/recovery?code=" + sha1(user.name + user.password) + "&email=" + user.email + " Acteam Group");
    else
      callback(err);
  });

}

module.exports.recoveryPassword = recoveryPass;

function resetpass(password, email, code, callback) {
  console.log("hey" + email + password + code);

  Organization.findOne({
    "email": email
  }, function(err, user) {
    if (!err && user) {
      if (sha1(user.name + user.password) === code) {

        user.password = sha1(password);
        user.save(function(err2) {
          callback(err2, user);
        });
      }
    } else
      callback(err);
  });
  Account.findOne({
    "email": email
  }, function(err, user) {
    if (!err && user) {
      if (sha1(user.name + user.password) === code) {
        user.password = sha1(password);
        user.save(function(err2) {
          callback(err2, user);
        });
      }
    } else
      callback(err);
  });
}

module.exports.resetpassword = resetpass;

function deleteaccount(user, callback) {
  if (user.role === "organization") {
    Organization.find({
      "email": user.email
    }).remove(function(err) {
      if (err) {
        callback(err);
      } else
        callback(true);
    });
  } else {
    Account.find({
      "email": user.email
    }).remove(function(err) {
      if (err) {
        callback(err);
      } else
        callback(true);
    });
  }


}
module.exports.deleteacc = deleteaccount;

function findUsr(email, callback) {
  Organization.findOne({
    "email": email
  }, function(err, user) {
    if (!err && user) {
      callback(err, true);
    } else {
      Account.findOne({
        "email": email
      }, function(err, user) {
        if (!err && user) {
          callback(err, true);
        } else
          callback(err, false);
      });
    }
  });
}

module.exports.findUser = findUsr;

function checkIfEventExists(name, callback) {
  Event.findOne({
    "name": name
  }, function(event, err) {
    if (!err) {
      callback(err, true);
    } else {
      callback(err, false);
    }
  });
}

module.exports.checkEventExists = checkIfEventExists;

function approveOrganizationAccount(data, callback) {
  if (data.isOrgApproved === "true") {
    Organization.findOne({
      "email": data.email
    }, function(err, user) {

      if (user) {
        console.log("MONEY");
        user.isOrgApproved = true;

        user.save(function(err2) {
          callback(err2, user);
        });

      } else
        callback(err);
    });
  } else if (data.isOrgApproved === "false") {
    Organization.findOne({
      "email": data.email,

    }, function(err, user) {

      if (user) {

        var org = {};
        org.email = data.email;
        org.role = "organization";
        deleteaccount(org, function(errw) {
          console.log("Ya screwed boy");
          callback(errw);
        });

      } else
        callback(err);
    });
  }

}

module.exports.approveOrgAcc = approveOrganizationAccount;