const router = require('express').Router();
const utils = require('../../../utils');
const Transactions = require('../../../models/Transactions');

router.get('/transactions', (req, res) => {
  Transactions.find({ registerId: req.user.registerId }).select('-_id -__v -registerId').then((transactions) => {
    res.json(transactions);
  }).catch(utils.handleError(res));
});

router.get('/transactions/:offset/:limit', (req, res) => {
  const { limit, offset } = req.params;
  Transactions.find({ registerId: req.user.registerId }).skip(parseInt(offset)).limit(parseInt(limit)).select('-_id -__v -registerId').then((transactions) => {
    if (!transactions.length) {
      res.status(404).json([]);
    } else {
      res.json(transactions);
    }
  }).catch(utils.handleError(res));
});

router.post('/transactions', (req, res) => {
  const registerId = req.user.registerId;
  const number = req.body.number;
  Transactions.findOne({ registerId, number }).select('_id').then((transaction) => {
    if (transaction) {
      throw { code: 400, msg: 'srv_transaction_number_already_exists' };
    }
    const newTransaction = { ...req.body, registerId };
    return new Transactions(newTransaction).save();
  }).then((transaction) => {
    const { _id, __v, registerId, ...t } = transaction._doc;
    res.json(t);
  }).catch(utils.handleError(res));
});

module.exports = router;
