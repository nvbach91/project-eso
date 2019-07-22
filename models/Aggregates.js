const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Aggregates = new Schema({
  date: Number,
  regId: Schema.ObjectId,
  revByVat: {},
  revByGroup: {},
  soldCnt: {},
  cancelRev: {},
  cancelRevByEmp: {},
  nTrans: Number,
  nProdSold: Number,
  hourSales: {},
  hourTrans: {},
  revByPayment: {},
  revByEmp: {},
  round: Number
});

Aggregates.index({ regId: 1, date: -1 }, { unique: true }); // index from most recent

module.exports = mongoose.model('aggregates', Aggregates);
