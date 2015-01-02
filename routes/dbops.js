var passport = require('../app').auth;
var Account = require('../models/account');
var Admin = require('../models/admin');
var Promoted = require('../models/promoted');
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
      //console.log(data);
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


function getOrgEvents(orgEmail, callback) {
  var currentTime = new Date();
  if (orgEmail === "") {
    Event.find({
      "people.email": "jpdias@live.com",
      "date.end": {
        $gt: currentTime
      }
    }, function(err, events) {
      callback(err, events);
    });
  } else {
    Event.find({
      "org_email": orgEmail,
      "date.end": {
        $gt: currentTime
      }
    }, function(err, events) {
      callback(err, events);
    });
  }
}


module.exports.getOrganizationEvents = getOrgEvents;

function getUsrEvents(userEmail, callback) {
  var currentTime = new Date();
  Event.find({
    "people.email": userEmail
  }, function(err, events) {
    callback(err, events);
  });
}

module.exports.getUserEvents = getUsrEvents;

function getEventsApplications(eventname, callback) {
  Event.findOne({
    "name": eventname
  }, function(err, events) {
    callback(err, events.people);
  });
}

module.exports.getEventsApp = getEventsApplications;

function setEvApplyStatus(eventname, email, check, callback) {
  Event.findOne({
    "name": eventname
  }, function(err, events) {
    console.log(check);
    for (var i = 0; i < events.people.length; i++) {
      if (events.people[i].email === email) {
        events.people[i].status = check;
        break;
      }
    }

    console.log(events);
    events.save(function(err) {
      console.log(err);
      callback(err, events);
    });
  });
}

module.exports.setEvApply = setEvApplyStatus;

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
    console.log(events);

    var status = true;

    for (var i = 0, max = events.people.length; i < max; i++) {
      if (events.people[i].email === userEmail) {
        status = false;
        break;
      }
    }

    if (status) {
      events.people.push({
        email: userEmail,
        status: false
      });
      events.save(function(err) {
        callback(err, events);
      });
    } else {
      callback("error", events);
    }
  });
}

module.exports.setApplyEvent = applyToEvent;

function addEventToOrg(event, orgName, callback) {
  Organization.findOne({
    "email": orgName
  }, function(err, org) {
    var newEvent = new Event(event);

    if (org.length === 0) {
      callback("Organization does not exist", event);
      return;
    }

    Event.find({
      "name": newEvent.name
    }, function(err, events) {

      if (events.length !== 0) {
        callback("Event with same name", newEvent);
        return;
      }

      newEvent.save(function(err) {
        if (err) {
          callback(err, event);
        } else {
          callback(err, event);
        }
      });
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

function recoveryPass(email, host, callback) {
  Organization.findOne({
    "email": email
  }, function(err, user) {
    if (!err && user)
      common.email(email, "Acteam Network", "Hello, Recovery Password Link: http://" + host + "/recoverypassword?code=" + sha1(user.name + user.password) + "&email=" + user.email + " Acteam Group");
    else
      callback(err);
  });
  Account.findOne({
    "email": email
  }, function(err, user) {
    if (!err && user)
      common.email(email, "Acteam Network", "Hello, Recovery Password Link: http://" + host + "/recovery?code=" + sha1(user.name + user.password) + "&email=" + user.email + " Acteam Group");
    else
      callback(err);
  });

}

module.exports.recoveryPassword = recoveryPass;

function resetpass(password, email, code, callback) {
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
          callback(errw);
        });

      } else
        callback(err);
    });
  }

}

module.exports.approveOrgAcc = approveOrganizationAccount;

function deleteOrganizationAccount(data, callback) {
  Organization.findOne({
    "email": data.email,
  }, function(err, user) {
    if (user) {
      var org = {};
      org.email = data.email;
      org.role = "organization";
      deleteaccount(org, function(errw) {
        callback(errw);
      });
    } else {
      Account.findOne({
        "email": data.email,
      }, function(err, user) {
        if (user) {
          user = {};
          user.email = data.email;
          user.role = "user";
          deleteaccount(user, function(errw) {
            callback(errw);
          });
        } else
          callback(err);
      });
    }
  });
}

module.exports.deleteOrgAcc = deleteOrganizationAccount;

function changeRecruitmentStatus(data, callback) {
  Organization.findOne({
    "email": data.email,
  }, function(err, org) {
    if (org) {
      org.recruitment.status = !org.recruitment.status;
      org.save(function(err2) {
        callback(err2, org);
      });
    } else {
      callback(err, org);
    }
  });
}

module.exports.changeRecruit = changeRecruitmentStatus;

function addNewMemberToRecruit(email, data, callback) {
  Organization.findOne({
    "email": email
  }, function(err, org) {
    if (org) {
      org.recruitment.appliances.push(data);
      org.save(function(err2) {
        callback(err2, org);
      });
    } else {
      callback(err, org);
    }
  });
}

module.exports.addNewMemberRecruit = addNewMemberToRecruit;

function memberReg(data, callback) {
  Organization.findOne({
    "email": data.org
  }, function(err, org) {
    if (org) {
      var tmp = org.recruitment.appliances;
      for (var j = 0; j < tmp.length; j++) {
        if (tmp[j].email === data.email) {
          tmp.splice(j, 1);
          break;
        }
      }
      org.recruitment.appliances = tmp;
      if (data.accept) {
        org.members.push({
          email: data.email
        });
      }
      org.save(function(err2) {
        callback(err2, org);
      });
    } else {
      callback(err, org);
    }
  });
}

module.exports.memberRegestration = memberReg;

function rmMemberFromOrg(data, callback) {
  //  console.log(data);
  Organization.findOne({
    "email": data.email
  }, function(err, org) {
    console.log(org);
    if (org) {
      var tmp = org.members;
      for (var j = 0; j < tmp.length; j++) {
        if (tmp[j].email === data.remove_email) {
          tmp.splice(j, 1);
          break;
        }
      }
      org.save(function(err2) {
        callback(err2, org);
      });
    } else {
      callback(err, org);
    }
  });
}

module.exports.removeMemberFromOrganization = rmMemberFromOrg;

function addToPromote(data, callback) {
  var pro = new Promoted(data);

  pro.save(function(error, data) {

    if (error) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

module.exports.addPromo = addToPromote;

function getPromotionalReq(callback) {
  Promoted.find({
    "isValidate": false
  }, function(err, data) {
    callback(err, data);
  });
}

module.exports.getPromoReq = getPromotionalReq;


function getPromotional(callback) {
  Promoted.find({
    "isValidate": true
  }, function(err, data) {
    callback(err, data);
  });
}

module.exports.getPromo = getPromotional;


function setPromotionalReq(datax, callback) {

  Promoted.findOne({
    "org_email": datax.email
  }, function(err, data) {
    if (datax.confirm) {
      data.isValidate = true;
      data.save(function(error, data) {
        if (error) {
          callback(true);
        } else {
          callback(false);
        }
      });
    } else {
      Promoted.remove(data).exec();
    }
  });
}

module.exports.setpromo = setPromotionalReq;

function getPromoOrgs(callback) {
  var currentTime = new Date();
  Promoted.find().remove({
    "date.end": {
      $lt: currentTime
    }
  }, function(err) {
    Promoted.find({
      "isValidate": true
    }, function(err, orgs) {
      callback(err, orgs);
    });
  });
}

module.exports.getPromotedOrgs = getPromoOrgs;

function ifOrgIsPromoted(email, callback) {
  Promoted.find({
    "org_email": email,
  }, function(err, orgs) {
    //  console.log(orgs);
    if (orgs.length === 0) {
      //  console.log("FALSE, IS NOT PROMOTED");
      callback(err, false);
    } else {
      //  console.log("TRUE, IS PROMOTED");
      callback(err, true);
    }
  });
}

module.exports.ifOrganizationIsPromoted = ifOrgIsPromoted;