const router = require('express').Router();
const utils = require('../../../utils');
//const Aggregates = require('../../../models/Aggregates');
const aggregates = {
  '20190626:20190626': { "start": 20190626, "end": 20190626, "revenueByTax": { "0": 1794, "10": 84, "15": 849.1, "21": 395.41 }, "revenueSentToORS": { "0": 0, "10": 0, "15": 0, "21": 0 }, "revenueByGroup": { "1": 212.9, "2": 204, "3": 2125.3, "4": 636.81, "5": 84, "6": 288, "7": 642 }, "revenueByEmployee": { "demo": 12527.51, "abc": 40 }, "revenueByPaymentMethod": { "cash": 12147.51, "card": 320, "cheque": 100 }, "revenueByForeignCurrency": {}, "round": 0.49, "canceledRevenues": { "2": -20, "not_plu": -2817.7 }, "canceledRevenuesByEmployee": { "demo": -2837.7, "abc": 0 }, "soldCntByEan": { "0": 49, "1": 14, "2": 25, "3": 35, "4": 44, "5": 13, "6": 5, "7": 11, "8": 11, "9": 5, "30": 9, "31": 1, "32": 3, "33": 1, "54": 3, "55": 1, "56": 1, "57": 1, "333": 40, "9115": 2, "105713": 4, "not_plu": 185, "034": 5, "035": 1, "036": 1 }, "hourlyTotalSales": { "0": 656.5, "1": 21, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 60, "11": 89, "12": 167, "13": 560, "14": 237.4, "15": 2403.7, "16": 339, "17": 90, "18": 0, "19": 736.3, "20": 6732.41, "21": -73.79999999999998, "22": 18, "23": 531 }, "hourlyTransCnt": { "0": 13, "1": 3, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 1, "11": 2, "12": 6, "13": 10, "14": 5, "15": 7, "16": 5, "17": 1, "18": 0, "19": 2, "20": 19, "21": 4, "22": 1, "23": 6 }, "nProductsSold": 470, "nTransactions": 85 },
  '20190625:20190625': { "start": 20190625, "end": 20190625, "revenueByTax": { "0": 794, "10": 84, "15": 494.1, "21": 3995.41 }, "revenueSentToORS": { "0": 0, "10": 0, "15": 0, "21": 0 }, "revenueByGroup": { "1": 212.9, "2": 204, "3": 2125.3, "4": 636.81, "5": 84, "6": 288, "7": 642 }, "revenueByEmployee": { "demo": 12527.51, "abc": 40 }, "revenueByPaymentMethod": { "cash": 12147.51, "card": 320, "cheque": 100 }, "revenueByForeignCurrency": {}, "round": 0.49, "canceledRevenues": { "2": -20, "not_plu": -2817.7 }, "canceledRevenuesByEmployee": { "demo": -2837.7, "abc": 0 }, "soldCntByEan": { "0": 49, "1": 14, "2": 25, "3": 35, "4": 44, "5": 13, "6": 5, "7": 11, "8": 11, "9": 5, "30": 9, "31": 1, "32": 3, "33": 1, "54": 3, "55": 1, "56": 1, "57": 1, "333": 40, "9115": 2, "105713": 4, "not_plu": 185, "034": 5, "035": 1, "036": 1 }, "hourlyTotalSales": { "0": 656.5, "1": 21, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 60, "11": 89, "12": 167, "13": 560, "14": 237.4, "15": 2403.7, "16": 339, "17": 90, "18": 0, "19": 736.3, "20": 6732.41, "21": -73.79999999999998, "22": 18, "23": 531 }, "hourlyTransCnt": { "0": 13, "1": 3, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 1, "11": 2, "12": 6, "13": 10, "14": 5, "15": 7, "16": 5, "17": 1, "18": 0, "19": 2, "20": 19, "21": 4, "22": 1, "23": 6 }, "nProductsSold": 470, "nTransactions": 85 },
};
router.get('/aggregates/:start/:end', (req, res) => {
  const { start, end } = req.params;
  console.log(start, end);
  res.json(aggregates[`${start}:${end}`]);
});


module.exports = router;
