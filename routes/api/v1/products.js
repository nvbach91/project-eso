const router = require('express').Router();
const Products = require('../../../models/Products');
const utils = require('../../../utils');

router.get('/products', (req, res) => {
  Products.find({ registerId: req.user.registerId }).select('-_id -__v -registerId').then((products) => {
    res.json(products);
  }).catch(utils.handleError(res));
});

router.post('/products', (req, res) => {
  const { ean, name, group, price, vat, img } = req.body;
  Products.update({ registerId: req.user.registerId, ean }, { $set: req.body }, { upsert: true }).then((info) => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/products/:ean', (req, res) => {
  const { ean } = req.params;
  Products.remove({ registerId: req.user.registerId, ean }).then((info) => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

module.exports = router;
