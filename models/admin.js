var mongoose = require('../app').mongodb,
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    passportLocalMongoose = require('passport-local-mongoose');

var Admin = new Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: {type: Boolean, default: false},
    role: String
});


module.exports = mongoose.model('Admin', Admin);
