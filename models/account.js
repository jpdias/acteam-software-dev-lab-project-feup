var mongoose = require('../app').mongodb,
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    email: String,
    password: String,
    address: {
      address: String,
      municipaly: String,
      district: String},
    birthdate: String,
    employee: String,
    university: String,
    gender: String,
    cv: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
