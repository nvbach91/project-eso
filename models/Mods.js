const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mods = new Schema({
  regId: Schema.ObjectId,
  position: Number,
  number: Number,
  name: String,
  price: String,
  type: String,
  img: String,
  eans: Object, // { 1: true, 2: true }
  limit: Number, // max order quantity per order item
  active: Boolean,
}, { minimize: false });

Mods.index({ regId: 1, number: 1 }, { unique: true }); // index from most recent

module.exports = mongoose.model('mods', Mods);
