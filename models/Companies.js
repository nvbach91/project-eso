const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Companies = new Schema({
  subdomain: { type: String, index: { unique: true} },
  tin: { type: String, index: { unique: true} },
  vat: String,
  name: String,
  isTaxable: Boolean,
  license: String,
  expiration: Date,
  bank: String,
  note: String,
  residence: Object, // { street, city, zip, country }
  email: { type: String, index: { unique: true } },
  phone: String,
  registrationDate: Date,
  language: String,
});

module.exports = mongoose.model('companies', Companies);
