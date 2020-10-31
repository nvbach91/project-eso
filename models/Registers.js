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
    extraPadding: Number 
  },
  carouselInterval: Number,
  currency: { 
    code: String, 
    locale: String, 
    rounding: Boolean, 
    symbol: String
  },
  printer: { 
    name: String, 
    diacritics: Boolean, 
    direct: Boolean, 
    columns: Number, 
    groups: String, 
  },
  kitchenPrinter: { 
    name: String, 
    diacritics: Boolean, 
    direct: Boolean, 
    columns: Number, 
    groups: String, 
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
    //   img: 'credit-card-min_aoqb3h',
    //   enabled: true 
    // },
    // 'cash': {
    //     img: 'cash-min_lautl6',
    //     enabled: true
    // }
  }, 
  activityTimeout: Number, // if the app is idle for this amount of time, an activity check dialog will appear
  activityCheckTimeout: Number, // if the app is idle for this amount of time after the check appeared, the app will reset
  autoNextTab: Boolean
});

module.exports = mongoose.model('registers', Registers);

/*
const settings = {
  number: 0,
  name: 'The Elusive Camel',
  address: {
    street: 'Americká 123',
    city: 'Praha 2',
    zip: '12000',
    country: 'Česká republika',
  },
  vatRates: [0, 10, 15, 21],
  residence: {
    street: 'Madridská 456',
    city: 'ěščřžýáíéúůďťň ĚŠČŘŽÝÁÍÉÚŮĎŤŇ',
      //+'\n' +
      // 'abcdefg{hijlkm}n opqrstuvwxyz\n' +
      // 'ABCDEFGHI`JLKMN OP´QRSTUVWXYZ\n' +
      // '1234567890-=[This is small];This is big\n' +
      // '\'\\,.//*-+\n' +
      // '~!@#$%^&*()_+{bold}:"|<>?\n' +
      // '°ˇ§¨',
    zip: '11000',
    country: 'Česká republika',
  },
  employees: {
    'kiosk': 'Kiosk',
    'demo@gmail.com': 'Demo pracovník',
  },
  receipt: {
    img: '',
    header: 'Enjoy your meal',
    footer: '\\tThank you for coming\\t\n\\telusivecamel.co.uk\\t',
    width: 80, // 48
    extraPadding: 4, // 0
  },
  tin: '12345678',
  vat: 'CZ12345678',
  carouselInterval: 20000,
  currency: { code: 'CZK', locale: 'cs', rounding: true, symbol: 'Kč' },
  printer: { name: 'EPSON TM-T20II Receipt', diacritics: true },
  terminal: {
    ip: '10.0.0.42',
    port: '2050',
    password: 'sJ8niYXknkLAdlM3s8WnFLNR2GdCMGaM8G8JxC7SizwIbu7QztAzY44y4A8Z1rMcwS9kvBH11QsA7LLP',
    endpoint: 'https://localhost:3443/pt',
    id: 'A123456',
  },
  ors: {
    public_key: '',
    private_key: '',
    vat: 'CZ12345678',
    file_name: '',
    store_id: 11,
    upload_date: '2019-05-03T12:54:11.000Z',
    valid_until: '2022-05-03T12:54:11.000Z'
  },
  activityTimeout: 60000, // if the app is idle for this amount of time, an activity check dialog will appear
  activityCheckTimeout: 25000, // if the app is idle for this amount of time after the check appeared, the app will reset
  autoNextTab: false,
};

create slides in slides collection
  slides: [
    { regId: '', order: 0,img: 'bg09_hjz6no-min_sgc2il', text: "Touch to start" }, 
    { regId: '', order: 9,img: 'bg06_gmmeqj-min_nsxd6e', text: "Touch to start" },
  ]

  slides: [
    { regId: '', order: 1,img: 'bg10_coyfml-min_fcywew', text: "Touch to start" },
    { regId: '', order: 2,img: 'bg01_mog1lh-min_fbiyp4', text: "Touch to start" },
    { regId: '', order: 3,img: 'bg05_osoyo0-min_l20vdt', text: "Touch to start" },
    { regId: '', order: 4,img: 'bg04_i3fq68-min_ezecgd', text: "Touch to start" },
    { regId: '', order: 5,img: 'bg08_hsajsa-min_rcwj9g', text: "Touch to start" },
    { regId: '', order: 6,img: 'bg02_komziq-min_js6pl0', text: "Touch to start" },
    { regId: '', order: 7,img: 'bg03_tdlabn-min_xwllb6', text: "Touch to start" },
    { regId: '', order: 8,img: 'bg07_wrsdxe-min_vi4wot', text: "Touch to start" },
  ]
*/