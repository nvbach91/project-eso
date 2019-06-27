const router = require('express').Router();
const utils = require('../../../utils');
const Transactions = require('../../../models/Transactions');
const Aggregates = require('../../../models/Aggregates');

router.get('/transactions', (req, res) => {
  Transactions.find({ registerId: req.user.registerId }).select('-_id -__v -registerId').then((transactions) => {
    res.json(transactions);
  }).catch(utils.handleError(res));
});

router.get('/transactions/page/:offset/:limit', (req, res) => {
  const { limit, offset } = req.params;
  Transactions.find({ registerId: req.user.registerId }).skip(parseInt(offset)).limit(parseInt(limit)).select('-_id -__v -registerId').then((transactions) => {
    res.json(transactions);
  }).catch(utils.handleError(res));
});

router.get('/transactions/date/:d', (req, res) => {
  const { d } = req.params;
  Transactions.find({ registerId: req.user.registerId, d }).select('-_id -__v -registerId').then((transactions) => {
    res.json(transactions);
  }).catch(utils.handleError(res));
});

router.post('/transactions', (req, res) => {
  const registerId = req.user.registerId;
  const number = req.body.number;
  Transactions.findOne({ registerId, number }).select('_id').then((transaction) => {
    if (transaction) {
      throw { code: 400, msg: 'srv_transaction_number_already_exists' };
    }
    const newTransaction = { ...req.body, registerId, d: req.body.date.slice(0, 10).replace(/-/g, '') };
    return new Transactions(newTransaction).save();
  }).then((transaction) => {
    const { _id, __v, ...t } = transaction._doc;
    updateAggregates(t);
    res.json(t);
  }).catch(utils.handleError(res));
});

const updateAggregates = (t) => {
  const { d, registerId, date } = t;
  const $inc = {};
  const revByVat = {};
  const revByGroup = {};
  const soldCntByEan = {};
  let nProdSold = 0;
  let total = 0;
  /*
  {
    items: [{"quantity":1,"ean":"8","price":"131.00","group":0,"vat":15}],
    number: 19000000036,
    order: 2,
    date: 2019-06-26T12:23:05.778Z,
    delivery: 'eatin',
    payment: 'cash',
    discount: 0,
    clerk: 'demo@gmail.com',
    d: 20190626
  }
  */
  t.items.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;
    nProdSold += item.quantity % 1 === 0 ? item.quantity : 1;
    fillNestedInc(revByVat, item.vat, itemTotal);
    fillNestedInc(revByGroup, item.group, itemTotal);
    fillNestedInc(soldCntByEan, item.ean, item.quantity);
  });
  Object.keys(revByVat).forEach((vat) => $inc[`revByVat.${vat}`] = revByVat[vat]);
  Object.keys(revByGroup).forEach((group) => $inc[`revByGroup.${group}`] = revByGroup[group]);
  Object.keys(soldCntByEan).forEach((ean) => $inc[`soldCntByEan.${ean}`] = soldCntByEan[ean]);
  $inc[`revByEmp.${t.clerk.replace(/\./g, '-')}`] = total;
  $inc[`revByPayment.${t.payment}`] = total;
  $inc[`nTrans`] = 1;
  $inc[`nProdSold`] = nProdSold;
  const hour = new Date(date).getHours();
  $inc['hourSales.' + hour] = total;
  $inc['hourTrans.' + hour] = 1;
  
  //console.log($inc);
  Aggregates.updateOne({ date: d, registerId }, { $inc }, { upsert: true }).then((info) => {
    console.log(info);
  });
};

const fillNestedInc = (o, key, value) => {
  if (!o[key]) {
    o[key] = value;
  } else {
    o[key] += value;
  }
};

module.exports = router;
