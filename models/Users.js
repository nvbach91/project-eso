const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
  username: { type: String, index: { unique: true } },
  password: String,
  email: String,
  token: String,
  name: String,
  registerId: Schema.ObjectId,
  companyId: Schema.ObjectId,
});

module.exports = mongoose.model('users', Users);