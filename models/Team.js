const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'companies',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Team = mongoose.model('team', TeamSchema);