const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../../../models/Users');
const utils = require('../../../utils');

router.delete('/employee', (req, res) => {
  Users.find({ regId: req.user.regId }).then((users) => {
    if (users.length === 1) {
      return res.json({ success: false });
    }
    Users.remove({ username: req.body.username }).then(() => {
      res.json({ msg: 'srv_success' });
    });
  });
});

router.post('/employee', (req, res) => {
  const { email, name, newpassword } = req.body;
  const { companyId, regId, subdomain } = req.user;
  const toSet = { subdomain, email, token: '', name, role: 'admin', companyId, regId };
  const password = newpassword ? bcrypt.hashSync(newpassword, bcrypt.genSaltSync(10)) : '';
  if (password) {
    toSet.password = password;
  }
  Users.updateOne({ username: [subdomain, email].join(':'), }, { $set: toSet }, { upsert: true }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});


module.exports = router;
