var mongoose = require('../app').mongodb,
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var User = new Schema( { name: String ,
                         location: { country: String,
                                     district: String,
                                     town: String
                                    }
                        }
                   );

var Users = mongoose.model('User', User);

exports.Users = Users;
