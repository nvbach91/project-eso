const router = require('express').Router();
const Products = require('../../../models/Products');
const utils = require('../../../utils');

router.get('/products', (req, res) => {
  Products.find({ regId: req.user.regId }).select('-_id -__v -regId').then((products) => {
    res.json(products);
  }).catch(utils.handleError(res));
});

router.post('/products', (req, res) => {
  const { ean, name, group, price, vat, img } = req.body;
  Products.update({ regId: req.user.regId, ean }, { $set: req.body }, { upsert: true }).then((info) => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/products/:ean', (req, res) => {
  const { ean } = req.params;
  Products.remove({ regId: req.user.regId, ean }).then((info) => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

module.exports = router;
