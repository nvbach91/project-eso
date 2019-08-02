const router = require('express').Router();
const Products = require('../../../models/Products');
const utils = require('../../../utils');

router.get('/products', (req, res) => {
  Products.find({ regId: req.user.regId }).select('-_id -__v -regId').then((products) => {
    res.json(products);
  }).catch(utils.handleError(res));
});

router.post('/products', (req, res) => {
  const { ean, highlight, ...product } = req.body;
  const update = { $set: product };
  if (!highlight) {
    update.$unset = { highlight: true };
  } else {
    update.$set.highlight = true;
  }
  Products.updateOne({ regId: req.user.regId, ean }, update, { upsert: true }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/products/:ean', (req, res) => {
  const { ean } = req.params;
  Products.remove({ regId: req.user.regId, ean }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

module.exports = router;
