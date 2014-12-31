var mongoose = require('../app').mongodb,
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var Promoted = new Schema({
  org_name: String,
  org_email: String,
  date: {
    start: {
      type: Date,
      default: Date.now
    },
    end: {
      type: Date,
      default: Date.now
    }
  },
  isValidate: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('Promoted', Promoted);
