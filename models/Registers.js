const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Registers = new Schema({
  subdomain: String,
  number: Number,
  street: String,
  city: String,
  zip: String,
  country: String,
});

module.exports = mongoose.model('registers', Registers)