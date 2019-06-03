const router = require('express').Router();
const utils = require('../../../utils');
const Transactions = require('../../../models/Transactions');

router.get('/transactions', (req, res) => {
  Transactions.find({ registerId: req.user.registerId }).select('-_id -__v -registerId').then((transactions) => {
    res.json(transactions);
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/transactions/last', (req, res) => {
  Transactions.find({ registerId: '5cf3fe3a9f7f971f0c018db4' }).select('-_id -__v -registerId').limit(1).then((transactions) => {
    res.json(transactions[0]);
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

router.post('/transactions', (req, res) => {
  const registerId = req.user.registerId;
  const number = req.body.number;
  Transactions.findOne({ registerId, number }).select('_id').then((transaction) => {
    if (transaction) {
      throw { code: 400, msg: 'srv_transaction_number_already_exists' };
    }
    const newTransaction = {
      ...req.body,
      registerId
    };
    return new Transactions(newTransaction).save();
  }).then((transaction) => {
    const { _id, __v, registerId, ...t } = transaction._doc;
    res.json(t);
  }).catch(utils.handleError(res));
});

module.exports = router;
