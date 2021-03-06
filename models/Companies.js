const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Companies = new Schema({
  subdomain: { type: String, index: { unique: true} },
  tin: { type: String, index: { unique: true} },
  vat: String,
  companyName: String,
  vatRegistered: Boolean,
  license: String,
  expiration: Date,
  bank: String,
  note: String,
  residence: Object, // { street, city, zip, country }
  email: String,
  phone: String,
  registrationDate: Date,
  language: String,
  theme: String,
  img: String,
}, { minimize: false});

module.exports = mongoose.model('companies', Companies);
