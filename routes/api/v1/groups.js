const router = require('express').Router();
const Groups = require('../../../models/Groups');
const Registers = require('../../../models/Registers');
const utils = require('../../../utils');

router.get('/groups', (req, res) => {
  Registers.findOne({ _id: req.user.regId }).select('syncRegId').then((register) => {
    return Groups.find({ regId: register.syncRegId || req.user.regId }).select('-_id -__v -regId');
  }).then((groups) => {
    res.json(groups);
  }).catch(utils.handleError(res));
});

router.post('/groups', async (req, res) => {
  const register = await Registers.findOne({ _id: req.user.regId }).select('syncRegId');
  if (register.syncRegId) {
    return res.status(403).json({ success: false, msg: 'srv_cannot_modify_synced_reg' });
  }

  const { number, ...group } = req.body;
  Groups.updateOne({ regId: req.user.regId, number }, { $set: group }, { upsert: true }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/groups/:number', async (req, res) => {
  const register = await Registers.findOne({ _id: req.user.regId }).select('syncRegId');
  if (register.syncRegId) {
    return res.status(403).json({ success: false, msg: 'srv_cannot_modify_synced_reg' });
  }

  const { number } = req.params;
  Groups.deleteOne({ regId: req.user.regId, number }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

module.exports = router;
