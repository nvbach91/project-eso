const router = require('express').Router();
const Products = require('../../../models/Products');
const utils = require('../../../utils');

router.get('/products', (req, res) => {
  Products.find({ registerId: req.user.registerId }).select('-_id -__v -registerId').then((products) => {
    res.json(products);
  }).catch(utils.handleError(res));
});

module.exports = router;
