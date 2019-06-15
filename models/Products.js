const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Products = new Schema({
  registerId: Schema.ObjectId,
  ean: String,
  name: String,
  price: String,
  img: String,
  group: Number,
  vat: Number,
});

Products.index({ registerId: 1, ean: 1 }, { unique: true });

module.exports = mongoose.model('products', Products);