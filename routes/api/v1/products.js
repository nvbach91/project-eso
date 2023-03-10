const router = require('express').Router();
const Products = require('../../../models/Products');
const Registers = require('../../../models/Registers');
const Mods = require('../../../models/Mods');
const utils = require('../../../utils');
const bluebird = require('bluebird');

router.get('/products', (req, res) => {
  Registers.findOne({ _id: req.user.regId }).select('syncRegId').then((register) => {
    return Products.find({ regId: register.syncRegId || req.user.regId }).select('-_id -__v -regId');
  }).then((products) => {
    res.json(products);
  }).catch(utils.handleError(res));
});

router.post('/products', async (req, res) => {
  const register = await Registers.findOne({ _id: req.user.regId }).select('syncRegId');
  if (register.syncRegId) {
    return res.status(403).json({ success: false, msg: 'srv_cannot_modify_synced_reg' });
  }

  const { ean, highlight, mods, ...product } = req.body;
  const update = { $set: product };
  if (!highlight) {
    update.$unset = { highlight: true };
  } else {
    update.$set.highlight = true;
  }
  Products.updateOne({ regId: req.user.regId, ean }, update, { upsert: true }).then((updated) => {
    return Mods.find({ regId: req.user.regId }).select('eans number');
  }).then((dbMods) => {
    return bluebird.map(dbMods, (dbMod) => {
      const eans = { ...dbMod.eans };
      if (Object.keys(eans).includes(ean)) {
        if (!mods.includes(dbMod.number)) {
          delete eans[ean];
        }
      } else {
        if (mods.includes(dbMod.number)) {
          eans[ean] = true;
        }
      }
      return Mods.updateOne({ _id: dbMod._id }, { $set: { eans } });
    });
  }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/products/:ean', async (req, res) => {
  const register = await Registers.findOne({ _id: req.user.regId }).select('syncRegId');
  if (register.syncRegId) {
    return res.status(403).json({ success: false, msg: 'srv_cannot_modify_synced_reg' });
  }

  const { ean } = req.params;
  Products.deleteOne({ regId: req.user.regId, ean }).then(() => {
    return Mods.find({ regId: req.user.regId, [`eans.${ean}`]: true }).select('eans number');
  }).then((dbMods) => {
    return bluebird.map(dbMods, (dbMod) => {
      const eans = { ...dbMod.eans };
      delete eans[ean];
      return Mods.updateOne({ _id: dbMod._id }, { $set: { eans } });
    });
  }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

module.exports = router;
