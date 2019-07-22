const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Groups = new Schema({
  regId: Schema.ObjectId,
  number: Number,
  order: Number,
  name: String,
  img: String,
});

Groups.index({ regId: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('groups', Groups);