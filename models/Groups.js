const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Groups = new Schema({
  registerId: Schema.ObjectId,
  number: Number,
  name: String,
  img: String,
});

Groups.index({ registerId: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('groups', Groups);