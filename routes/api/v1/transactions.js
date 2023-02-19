const router = require('express').Router();
const axios = require('axios');
const moment = require('moment');
const utils = require('../../../utils');
const config = require('../../../config');
const Transactions = require('../../../models/Transactions');
const Aggregates = require('../../../models/Aggregates');
const Registers = require('../../../models/Registers');
const Companies = require('../../../models/Companies');

router.get('/transactions', (req, res) => {
  Transactions.find({ regId: req.user.regId }).select('-_id -__v -regId').then((transactions) => {
    res.json(transactions);
  }).catch(utils.handleError(res));
});

router.get('/transactions/page/:offset/:limit', (req, res) => {
  const { limit, offset } = req.params;
  Transactions.find({ regId: req.user.regId }).skip(parseInt(offset)).limit(parseInt(limit)).select('-_id -__v -regId').then((transactions) => {
    res.json(transactions);
  }).catch(utils.handleError(res));
});

router.get('/transactions/date/:d', (req, res) => {
  const { d } = req.params;
  Transactions.find({ regId: req.user.regId, d }).select('-_id -__v -regId').then((transactions) => {
    res.json(transactions);
  }).catch(utils.handleError(res));
});

router.post('/transactions', (req, res) => {
  const regId = req.user.regId;
  const number = req.body.number;
  let newTransaction;
  // console.log('creating new transaction', number);
  Transactions.findOne({ regId, number }).select('_id number regId').then((existingTransaction) => {
    if (existingTransaction) {
      console.error(new Date().toISOString(), 'existingTransaction', existingTransaction.regId, existingTransaction.number, req.user.username);
      throw { code: 400, msg: 'srv_transaction_number_already_exists' };
    }
    // throw { code: 400, msg: 'srv_transaction_number_already_exists' };
    newTransaction = { ...req.body, regId, d: moment(req.body.date).format('YYYYMMDD') };
    // if (existingTransaction) {
    //   // get the last number in the transaction list and increment it for the new transaction
    //   return Transactions.find({ regId: req.user.regId }).skip(0).limit(1).select('-_id -__v -regId').then((transactions) => {
    //     newTransaction.number = transactions[0].number + 1;
    //     // console.log('newTransactionNumber', newTransaction.number);
    //   });
    // }
    // return orsAuthorizeTransaction(newTransaction, req);
  }).then(() => {
    // console.log('inserting new transaction', newTransaction);
    return new Transactions(newTransaction).save();
  }).then((transaction) => {
    console.log('new_transaction', newTransaction.date, req.user.regId, newTransaction.number, req.user.username);
    const { _id, __v, ...t } = transaction._doc;
    updateAggregates(t);
    res.json(t);
  }).catch(utils.handleError(res));
});

const updateAggregates = (t) => {
  const { d, regId, date } = t;
  const $inc = {};
  const revByVat = {};
  const revByGroup = {};
  const soldCnt = {};
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
    let itemPrice = parseFloat(item.price);
    if (item.mods) {
      item.mods.forEach((mod) => {
        itemPrice += (mod.quantity || 1) * mod.price;
      });
    }
    const itemTotal = item.quantity * itemPrice;
    total += itemTotal;
    nProdSold += item.quantity % 1 === 0 ? item.quantity : 1;
    fillNestedInc(revByVat, item.vat, itemTotal);
    fillNestedInc(revByGroup, item.group, itemTotal);
    fillNestedInc(soldCnt, item.ean, item.quantity);
  });
  Object.keys(revByVat).forEach((vat) => $inc[`revByVat.${vat}`] = revByVat[vat]);
  Object.keys(revByGroup).forEach((group) => $inc[`revByGroup.${group}`] = revByGroup[group]);
  Object.keys(soldCnt).forEach((ean) => $inc[`soldCnt.${ean}`] = soldCnt[ean]);
  $inc[`revByEmp.${t.clerk.replace(/\./g, '-')}`] = total;
  $inc[`revByPayment.${t.payment}`] = total;
  $inc[`nTrans`] = 1;
  $inc[`nProdSold`] = nProdSold;
  const hour = new Date(date).getHours();
  $inc[`hourSales.${hour}`] = total;
  $inc[`hourTrans.${hour}`] = 1;

  //console.log($inc);
  Aggregates.updateOne({ date: d, regId }, { $inc }, { upsert: true }).then((info) => {
    //console.log(info);
  });
};

const fillNestedInc = (o, key, value) => {
  if (!o[key]) {
    o[key] = value;
  } else {
    o[key] += value;
  }
};

const orsAuthorizeTransaction = (newTransaction, req) => {
  return Registers.findOne({ _id: req.user.regId }).select('ors number').then((register) => {
    if (register.ors && register.ors.private_key) {
      let authorizationInfo = {};

      authorizationInfo.vat = register.ors.vat;
      authorizationInfo.posId = register.number;
      authorizationInfo.storeId = register.ors.store_id;
      authorizationInfo.public_key = register.ors.public_key;
      authorizationInfo.private_key = register.ors.private_key;
      authorizationInfo.items = JSON.stringify(newTransaction.items.map(({ price, quantity, vat }) => ({ price, quantity, vat })));
      authorizationInfo.date = newTransaction.date;
      authorizationInfo.number = newTransaction.number;

      return Companies.findOne({ _id: req.user.companyId }).select('vatRegistered').then((company) => {
        authorizationInfo.isTaxpayer = company.vatRegistered;
        return axios.post(config.orsSaleAuthorizationUrl, authorizationInfo, config.axiosConfig);
      }).then((resp) => {
        if (!resp.data.success) {
          throw { code: 500, msg: resp.data.msg };
        }
        newTransaction.fik = resp.data.msg.fik;
        newTransaction.bkp = resp.data.msg.bkp;
      });
    }
  });
};

module.exports = router;
