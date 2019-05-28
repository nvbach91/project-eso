const App = {};
window.App = App;
App.imageUrlBase = 'https://res.cloudinary.com/ceny24/image/upload/';

App.localhostServerURL = window.location.protocol + '//localhost:2443';
App.tableSyncServerURL = window.location.protocol + '//sync.vcap.me:2443';

const [ subdomain, domain, realm ] = location.hostname.split('.');
App.subdomain = subdomain;
App.domain = domain;
App.realm = realm;

App.provider = 'Ethereals United';

App.thisYear = new Date().getFullYear();
App.credits = App.thisYear + ' © ' + App.provider;

App.supportedLocales = {
  'en': 'English',
  'cs': 'Čeština',
  'sk': 'Slovenčina',
  'vi': 'tiếng Việt',
  'ko': '한국어',
  'ja': '日本語',
  'de': 'Deutsch',
};

App.formats = {
  dateTime: 'DD.MM.YYYY HH:mm:ss',
  dayDateTime: 'dddd DD.MM.YYYY HH:mm:ss',
  datePrefix: 'YYYYMMDD',
};

App.receipts = [
  {
    number: 19010000000,
    date: '2019-05-03T00:34:34.000Z',
    items: [
      {
        ean: '101',
        name: 'Noodle soup 101',
        price: '1.00',
        quantity: 2,
        tax: 10,
        category: 1,
      },
      {
        ean: '101',
        name: 'Noodle soup 101',
        price: '4.00',
        quantity: 32,
        tax: 0,
        category: 1,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '2.00',
        quantity: 217,
        tax: 21,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '27.00',
        quantity: 2,
        tax: 15,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '27.00',
        quantity: 28,
        tax: 10,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '27.00',
        quantity: 118,
        tax: 15,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '271.00',
        quantity: 7,
        tax: 0,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '371.00',
        quantity: 26,
        tax: 21,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '281.00',
        quantity: 110,
        tax: 15,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '1281.00',
        quantity: 1123,
        tax: 15,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '82781.00',
        quantity: 1123,
        tax: 15,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '8278.00',
        quantity: 11023,
        tax: 15,
        category: 4,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '8278.00',
        quantity: 11.023,
        tax: 15,
        category: 4,
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
];
