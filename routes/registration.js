const router = require('express').Router();
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');

router.post('/registration', (req, res) => {
  const username = req.body.subdomain + ':' + req.body.email;
  Users.findOne({ username }).select('_id').then((user) => {
    if (user) {
      throw { code: 400, msg: 'srv_user_already_exists' };
    }
    return bcrypt.genSalt(10);
  }).then((salt) => {
    return bcrypt.hash(req.body.password, salt);
  }).then((hash) => {
    return new Users({
      username,
      password: hash,
      email: req.body.email,
    }).save();
  }).then((user) => {
    res.json(user);
  }).catch((err) => {
    console.error(err);
    res.status(err.code || 500).json({ msg: err.msg || 'srv_internal_server_error' });
  });
});

module.exports = router;
