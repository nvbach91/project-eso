const router = require('express').Router();
const Mods = require('../../../models/Mods');
const utils = require('../../../utils');

router.get('/mods', (req, res) => {
  Mods.find({ regId: req.user.regId }).select('-_id -__v -regId').then((mods) => {
    res.json(mods);
  }).catch(utils.handleError(res));
});

router.post('/mods', (req, res) => {
  const { number, ...mod } = req.body;
  Mods.updateOne({ regId: req.user.regId, number }, { $set: mod }, { upsert: true }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/mods/:number', (req, res) => {
  const { number } = req.params;
  Mods.deleteOne({ regId: req.user.regId, number }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

module.exports = router;
