const router = require('express').Router();
const ObjectId = require('mongoose').Types.ObjectId;
const utils = require('../../../utils');
const Aggregates = require('../../../models/Aggregates');

const aggregateKeys = [
  'revByVat',
  'revByGroup',
  'soldCnt',
  'cancelRev',
  'cancelRevByEmp',
  'nTrans',
  'nProdSold',
  'hourSales',
  'hourTrans',
  'revByPayment',
  'revByEmp',
];

router.get('/aggregates/:keys/:start/:end/:regIds?', (req, res) => {
  const { start, end, keys, regIds } = req.params;
  const select = keys === 'all' ? aggregateKeys.join(' ') : keys.split(',').join(' ');
  const regIdFilter = regIds ? { $in: regIds.split(',').filter((regId) => ObjectId.isValid(regId)) } : req.user.regId;
  const query = { regId: regIdFilter, date: { $gte: start, $lte: end } };
  Aggregates.find(query).select(`${select} -_id`).then((aggregates) => {
    if (!aggregates.length) {
      return res.sendStatus(404);
    }
    const resp = {};
    aggregates.forEach((a) => {
      Object.keys(a._doc).forEach((key) => {
        if (typeof a[key] === 'number') {
          if (resp[key]) {
            resp[key] += a[key];
          } else {
            resp[key] = a[key];
          }
        } else if (typeof a[key] === 'object') {
          if (resp[key]) {
            Object.keys(a[key]).forEach((innerKey) => {
              if (resp[key][innerKey]) {
                resp[key][innerKey] += a[key][innerKey];
              } else {
                resp[key][innerKey] = a[key][innerKey];
              }
            });
          } else {
            resp[key] = { ...a[key] };
          }
        }
      });
    });
    res.json(resp);
  }).catch(utils.handleError(res));
});


module.exports = router;
