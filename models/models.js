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

mongoose.connect('mongodb://acteam:acteamadmin@ds031088.mongolab.com:31088/acteam');

var Users = mongoose.model('User', User);

exports.Users = Users;
