const router = require('express').Router();
const config = require('../config');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/auth', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json(info);
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.send(err);
      }
      const token = jwt.sign(user, config.secret);
      return Users.updateOne({ _id: user._id }, { $set: { token } }).then(() => {
        return res.json({ auth: true, user, token });
      });
    });
  })(req, res);
});

module.exports = router;
