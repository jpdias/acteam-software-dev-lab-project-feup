var mongoose = require('../app').mongodb,
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  name: String,
  email: String,
  password: String,
  address: {
    address: String,
    municipality: String,
    district: String
  },
  birthdate: String,
  occupation: [String],
  workplace: String,
  gender: String,
  cv: String,
  role: String,
  networks: {
    skype: String,
    facebook: String,
    flickr: String,
    instagram: String,
    linkedin: String,
    twitter: String,
    github: String,
    gplus: String
  },
  causes: [String],
  confirmed: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('Account', Account);