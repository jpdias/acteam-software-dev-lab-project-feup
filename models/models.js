var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var User = new Schema( { name: String ,
                         location: { country: String,
                                     district: String,
                                     town: String
                                    }
                        }
                   );

mongoose.connect('mongodb://127.0.0.1:27017/Acteam');

var Users = mongoose.model('User', User);

exports.Users = Users;
