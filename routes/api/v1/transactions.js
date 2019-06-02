const router = require('express').Router();
const Registers = require('../../../models/Registers');
const Transactions = require('../../../models/Transactions');
const mongoose = require('mongoose');

router.get('/transactions', (req, res) => {
  Transactions.find({ registerId: req.user.registerId }).select('-_id -__v').then((transactions) => {
    res.json(transactions);
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/transactions/last', (req, res) => {
  Transactions.find({ registerId: '5cf3fe3a9f7f971f0c018db4' }).select('-_id -__v').limit(1).then((transactions) => {
    res.json(transactions[0]);
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

router.post('/transactions', (req, res) => {
  const registerId = '5cf3fe3a9f7f971f0c018db4';//req.user.registerId;
  //Registers.findOne({ _id: registerId }).select('number').then((register) => {
  //  return Transactions.countDocuments({ registerId });
  //}).then((count) => {
  const transaction = {
    ...req.body,
    registerId
  };
  return new Transactions(transaction).save().then((tran) => {
    const { _id, __v, ...t } = tran._doc;
    res.json(t);
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
