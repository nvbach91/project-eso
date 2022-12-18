const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Registers = new Schema({
  subdomain: { type: String, index: true },
  number: Number,
  name: String,
  address: {
    street: String,
    city: String,
    zip: String,
    country: String
  },
  vatRates: [Number],
  receipt: {
    img: String,
    header: String,
    footer: String,
    extraPadding: Number,
    orderInitial: Number,
    masking: Boolean,
    highlightOrderNumber: Boolean,
    deliveryMethodPosition: String,
  },
  carouselInterval: Number,
  currency: {
    code: String,
    locale: String,
    rounding: Boolean,
    symbol: String
  },
  kioskPrinters: {
    // id: {
    //   name: String,
    //   ip: String,
    //   diacritics: Boolean,
    //   direct: Boolean,
    //   columns: Number,
    //   groups: String,
    //   style: String,
    // }
  },
  kitchenPrinters: {
    // id: {
    //   name: String,
    //   ip: String,
    //   diacritics: Boolean,
    //   direct: Boolean,
    //   columns: Number,
    //   groups: String,
    //   style: String,
    // }
  },
  labelPrinters: {
    // id: {
    //   name: String,
    //   ip: String,
    //   diacritics: Boolean,
    //   direct: Boolean,
    //   columns: Number,
    //   groups: String,
    //   top: Number,
    //   left: Number,
    //   fontSize: Number,
    //   style: String,
    // }
  },
  terminal: {
    ip: String,
    port: Number,
    password: String,
    endpoint: String,
    id: String,
  },
  ors: {
    public_key: String,
    private_key: String,
    vat: String,
    file_name: String,
    store_id: Number,
    upload_date: Date,
    valid_until: Date
  },
  paymentMethods: {
    // 'card': {
    //    img: 'credit-card-min_aoqb3h',
    //    enabled: true 
    // },
    // 'cash': {
    //    img: 'cash-min_lautl6',
    //    enabled: true
    // }
  },
  activityTimeout: Number, // if the app is idle for this amount of time, an activity check dialog will appear
  activityCheckTimeout: Number, // if the app is idle for this amount of time after the check appeared, the app will reset
  autoNextTab: Boolean,
  tableMarkers: {
    active: Boolean,
    img: String,
    required: Boolean,
  },
  gokasa: {
    ip: String,
    url: String,
  },
  finishMessage: '',
});

module.exports = mongoose.model('registers', Registers);
