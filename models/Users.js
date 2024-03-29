const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
  username: { type: String, index: { unique: true } },
  password: String,
  email: String,
  token: String,
  name: String,
  role: String,
  regId: Schema.ObjectId,
  companyId: Schema.ObjectId,
  subdomain: String,
});

module.exports = mongoose.model('users', Users);