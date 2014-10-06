var mongoose = require('../app').mongodb,
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var People = new Schema({
  email: String,
  status: Boolean
});

var Event =  new Schema({
  org_email:String,
  name: String,
  date:{
    start: {type: Date, default: Date.now},
    end: {type: Date, default: Date.now}
  },
  description: String,
  address: {address: String,
            municipaly: String,
            district: String
           },
  people:[People]
});

module.exports = mongoose.model('Event', Event);
