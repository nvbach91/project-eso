const router = require('express').Router();
const Mods = require('../../../models/Mods');
const Registers = require('../../../models/Registers');
const utils = require('../../../utils');

router.get('/mods', (req, res) => {
  Registers.findOne({ _id: req.user.regId }).select('syncRegId').then((register) => {
    return Mods.find({ regId: register.syncRegId || req.user.regId }).select('-_id -__v -regId');
  }).then((mods) => {
    res.json(mods);
  }).catch(utils.handleError(res));
});

router.post('/mods', async (req, res) => {
  const register = await Registers.findOne({ _id: req.user.regId }).select('syncRegId');
  if (register.syncRegId) {
    return res.status(403).json({ success: false, msg: 'srv_cannot_modify_synced_reg' });
  }

  const { number, ...mod } = req.body;
  Mods.updateOne({ regId: req.user.regId, number }, { $set: mod }, { upsert: true }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/mods/:number', async (req, res) => {
  const register = await Registers.findOne({ _id: req.user.regId }).select('syncRegId');
  if (register.syncRegId) {
    return res.status(403).json({ success: false, msg: 'srv_cannot_modify_synced_reg' });
  }

  const { number } = req.params;
  Mods.deleteOne({ regId: req.user.regId, number }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

module.exports = router;
