const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Transactions = new Schema({
  regId: Schema.ObjectId,
  number: Number,
  d: { type: Number, index: true }, // dateprefix
  date: Date,
  items: [],
  tendered: Number,
  payment: String,
  delivery: String,
  discount: 0,
  clerk: String,
  customer: String,
  order: Number,
  bkp: String,
  fik: String,
});

Transactions.index({ regId: 1, number: -1 }, { unique: true }); // index from most recent

module.exports = mongoose.model('transactions', Transactions);

/*
  {
    number: 19010000000,
    date: '2019-05-03T00:34:34.000Z',
    items: [
      {
        ean: '101',
        name: 'Noodle soup 101',
        price: '1.00',
        quantity: 2,
        vat: 10,
        group: 1,
      },
      {
        ean: '101',
        name: 'Noodle soup 101',
        price: '4.00',
        quantity: 32,
        vat: 0,
        group: 1,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '2.00',
        quantity: 217,
        vat: 21,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '27.00',
        quantity: 2,
        vat: 15,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '27.00',
        quantity: 28,
        vat: 10,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '27.00',
        quantity: 118,
        vat: 15,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '271.00',
        quantity: 7,
        vat: 0,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '371.00',
        quantity: 26,
        vat: 21,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '281.00',
        quantity: 110,
        vat: 15,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '1281.00',
        quantity: 1123,
        vat: 15,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '82781.00',
        quantity: 1123,
        vat: 15,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '8278.00',
        quantity: 11023,
        vat: 15,
        group: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '8278.00',
        quantity: 11.023,
        vat: 15,
        group: 4,
      },
    ],
    tendered: 185788281.39,
    payment: 'card',
    takeout: false,
    discount: 0,
    clerk: 'kiosk',
    bkp: '770decc5-1e34-4e65-8db2-6e93353e31a4',
    fik: 'e9eda986-9ea6-4aa7-a3b5-e2005779a45d',
    customer: '',
  }

*/
