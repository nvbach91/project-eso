const router = require('express').Router();
const Groups = require('../../../models/Groups');
const utils = require('../../../utils');

router.get('/groups', (req, res) => {
  Groups.find({ registerId: req.user.registerId }).select('-_id -__v -registerId').then((groups) => {
    res.json(groups);
  }).catch(utils.handleError(res));
});

module.exports = router;
