const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Products = new Schema({
  regId: Schema.ObjectId,
  ean: String,
  name: String,
  price: String,
  img: String,
  group: Number,
  vat: Number,
});

Products.index({ regId: 1, ean: 1 }, { unique: true });

module.exports = mongoose.model('products', Products);