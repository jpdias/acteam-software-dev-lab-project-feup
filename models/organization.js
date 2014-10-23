var mongoose = require('../app').mongodb,
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    passportLocalMongoose = require('passport-local-mongoose');

var Member = new Schema({
  email: String,
  position: String
});

var Proposal = new Schema({
  email: String,
  letter: String,
  status: Boolean
});


var Organization = new Schema({
    name: String,
    foundation: {type: Date, default: Date.now},
    email: String,
    website: String,
    password: String,
    address: {
      address: String,
      municipality: String,
      district: String
    },
    images:[String],
    members:[Member],
    about: String,
    causes: [String],
    recruitment:[{
      status: Boolean,
      time:{
        start:{type: Date, default: Date.now},
        end:{type: Date, default: Date.now}
      },
      appliances:[Proposal]
    }],
    networks:{
      skype: String,
      facebook: String,
      flickr: String,
      instagram: String,
      linkedin: String,
      twitter: String,
      github: String,
      gplus:String
    },
    isOrgApproved:{type: Boolean, default: false},
    confirmed:{type: Boolean, default: false},
    role: String
});

Organization.plugin(passportLocalMongoose);

module.exports = mongoose.model('Organization', Organization);
