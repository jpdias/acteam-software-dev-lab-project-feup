var mongoose = require('../app').mongodb,
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var Promoted = new Schema({
  org_email: String,
  event_name: String,
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
  description: String,
  type: String,
  value: Number,
  isPaid: Boolean
});

module.exports = mongoose.model('Promoted', Promoted);
