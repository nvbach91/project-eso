const router = require('express').Router();
const Registers = require('../../../models/Registers');
const Companies = require('../../../models/Companies');
const Users = require('../../../models/Users');
const utils = require('../../../utils');

router.get('/settings', (req, res) => {
  let settings = {};
  Registers.findOne({ _id: req.user.regId }).select('-_id -__v').then((register) => {
    settings = { ...register._doc };
    return Companies.findOne({ _id: req.user.companyId }).select('tin vat residence');
  }).then((company) => {
    const { residence, tin, vat } = company._doc;
    settings = { ...settings, residence, tin, vat };
    return Users.find({ companyId: req.user.companyId }).select('username name');
  }).then((users) => {
    settings.employees = {};
    users.forEach((user) => settings.employees[user.username.split(':')[1]] = user.name);
    res.json(settings);
  }).catch(utils.handleError(res));
});

module.exports = router;
