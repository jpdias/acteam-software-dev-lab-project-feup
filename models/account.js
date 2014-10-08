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
      municipaly: String,
      district: String},
    birthdate: String,
    occupation: String,
    workplace: String,
    gender: String,
    cv: String,
    role:String
});


module.exports = mongoose.model('Account', Account);
