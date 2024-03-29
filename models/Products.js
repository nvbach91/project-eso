const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Products = new Schema({
  regId: Schema.ObjectId,
  position: Number,
  highlight: Boolean,
  promotion: String,
  ean: String,
  name: String,
  price: String,
  img: String,
  desc: String,
  group: Number,
  vat: Number,
  active: Boolean,
  available: Boolean,
});

Products.index({ regId: 1, ean: 1 }, { unique: true });

module.exports = mongoose.model('products', Products);