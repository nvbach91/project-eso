const router = require('express').Router();
const Groups = require('../../../models/Groups');
const utils = require('../../../utils');

router.get('/groups', (req, res) => {
  Groups.find({ regId: req.user.regId }).select('-_id -__v -regId').then((groups) => {
    res.json(groups);
  }).catch(utils.handleError(res));
});

router.post('/groups', (req, res) => {
  const { number, name, order, vat, img } = req.body;
  Groups.update({ registerId: req.user.registerId, number }, { $set: req.body }, { upsert: true }).then((info) => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/groups/:number', (req, res) => {
  const { number } = req.params;
  Groups.remove({ registerId: req.user.registerId, number }).then((info) => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

module.exports = router;
