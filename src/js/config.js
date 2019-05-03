const App = {};
window.App = App;
App.imageUrlBase = 'https://res.cloudinary.com/ceny24/image/upload/';

App.localhostPort = window.location.protocol === 'https:' ? 2443 : 2080;
App.localhostServerURL = window.location.protocol + '//localhost:' + App.localhostPort;
App.tableSyncServerURL = window.location.protocol + '//sync.vcap.me:' + App.localhostPort;

App.realm = 'cz';
App.domain = 'ethereal.' + App.realm;
App.thisYear = new Date().getFullYear();
App.receiptCredits = App.thisYear + ' (c) ' + App.domain + ' ';

App.receiptWidths = {
  '80': { printWidth: 50, extraPadding: 4 },
  '58': { printWidth: 33, extraPadding: 0 },
};

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
App.settings = {
  number: 0,
  name: 'The Elusive Camel',
  address: {
    street: 'Americká 123',
    city: 'Praha 2',
    zip: '12000',
    country: 'Česká republika',
  },
  taxRates: [0, 10, 15, 21],
  residence: {
    street: 'Madridská 456',
    city: 'Praha 1',
    zip: '11000',
    country: 'Česká republika',
  },
  employees: {
    kiosk: 'Kiosk'
  },
  receipt: {
    img: '',
    header: 'Enjoy your meal',
    footer: '\\tThank you for coming\\t\n\\telusivecamel.co.uk\\t',
    width: 80,
  },
  tin: '12345678',
  vat: 'CZ12345678',
  carouselInterval: 20000,
  currency: { code: 'CZK', symbol: 'Kč' },
  printer: 'Epson TM-T20II',
  paymentTerminal: {
    ip: '10.0.0.42',
    port: '2050',
    password: 'sJ8niYXknkLAdlM3s8WnFLNR2GdCMGaM8G8JxC7SizwIbu7QztAzY44y4A8Z1rMcwS9kvBH11QsA7LLP',
    endpoint: 'https://localhost:3443/pt',
  },
  ors: {
    public_key: '',
    private_key: '',
    vat: 'CZ12345678',
    fileName: '',
    store_id: '11',
    upload_date: '2019-05-03T12:54:11.000Z',
    valid_until: '2022-05-03T12:54:11.000Z'
  },
  activityTimeout: 60000, // if the app is idle for this amount of time, an activity check dialog will appear
  activityCheckTimeout: 25000, // if the app is idle for this amount of time after the check appeared, the app will reset
};
App.categories = {
  '0': { name: 'Soups', img: 'bg09_hjz6no' },
  '1': { name: 'Beers', img: 'bg10_coyfml' },
  '2': { name: 'Beverages', img: 'bg07_wrsdxe' },
  '3': { name: 'Coffees', img: 'bg04_i3fq68' },
  '4': { name: 'Menus', img: 'bg06_gmmeqj' },
  '5': { name: 'Burgers', img: 'bg01_mog1lh' },
  '6': { name: 'Rice', img: 'bg05_osoyo0' },
  '7': { name: 'Noodles', img: 'bg02_komziq' },
  '8': { name: 'Wraps', img: 'bg03_tdlabn' },
  '9': { name: 'Fasties', img: 'bg08_hsajsa' },
  '00': { name: 'Soups', img: 'bg09_hjz6no' },
  '11': { name: 'Beers', img: 'bg10_coyfml' },
  '22': { name: 'Beverages', img: 'bg07_wrsdxe' },
  '33': { name: 'Coffees', img: 'bg04_i3fq68' },
  '44': { name: 'Menus', img: 'bg06_gmmeqj' },
  '55': { name: 'Burgers', img: 'bg01_mog1lh' },
  '66': { name: 'Rice', img: 'bg05_osoyo0' },
  '77': { name: 'Noodles', img: 'bg02_komziq' },
  '88': { name: 'Wraps', img: 'bg03_tdlabn' },
  '99': { name: 'Fasties', img: 'bg08_hsajsa' },
};
App.products = {
  "0": {
    "name": "swallow grass",
    "price": "142.00",
    "img": "bg09_hjz6no",
    "category": "2"
  },
  "1": {
    "name": "freight dream",
    "price": "142.00",
    "img": "bg10_coyfml",
    "category": "2"
  },
  "2": {
    "name": "comfort veil",
    "price": "112.00",
    "img": "bg07_wrsdxe",
    "category": "7"
  },
  "3": {
    "name": "equinox faint",
    "price": "172.00",
    "img": "bg04_i3fq68",
    "category": "4"
  },
  "4": {
    "name": "cunning voyage",
    "price": "156.00",
    "img": "bg06_gmmeqj",
    "category": "3"
  },
  "5": {
    "name": "trolley bus",
    "price": "171.00",
    "img": "bg01_mog1lh",
    "category": "2"
  },
  "6": {
    "name": "scandal shark",
    "price": "181.00",
    "img": "bg05_osoyo0",
    "category": "0"
  },
  "7": {
    "name": "primary die",
    "price": "162.00",
    "img": "bg02_komziq",
    "category": "7"
  },
  "8": {
    "name": "capital top",
    "price": "131.00",
    "img": "bg03_tdlabn",
    "category": "0"
  },
  "9": {
    "name": "service pull",
    "price": "119.00",
    "img": "bg08_hsajsa",
    "category": "8"
  },
  "11": {
    "name": "reactor deer",
    "price": "242.00",
    "img": "bg10_coyfml",
    "category": "5"
  },
  "22": {
    "name": "freedom cherry",
    "price": "212.00",
    "img": "bg07_wrsdxe",
    "category": "2"
  },
  "33": {
    "name": "recruit kneel",
    "price": "272.00",
    "img": "bg04_i3fq68",
    "category": "4"
  },
  "44": {
    "name": "dribble suburb",
    "price": "256.00",
    "img": "bg06_gmmeqj",
    "category": "3"
  },
  "55": {
    "name": "overall oak",
    "price": "271.00",
    "img": "bg01_mog1lh",
    "category": "2"
  },
  "66": {
    "name": "cabinet pass",
    "price": "281.00",
    "img": "bg05_osoyo0",
    "category": "7"
  },
  "77": {
    "name": "release cope",
    "price": "262.00",
    "img": "bg02_komziq",
    "category": "0"
  },
  "88": {
    "name": "penalty sniff",
    "price": "231.00",
    "img": "bg03_tdlabn",
    "category": "1"
  },
  "99": {
    "name": "clothes walk",
    "price": "219.00",
    "img": "bg08_hsajsa",
    "category": "0"
  },
  "111": {
    "name": "fortune linen",
    "price": "342.00",
    "img": "bg10_coyfml",
    "category": "6"
  },
  "522": {
    "name": "skilled jaw",
    "price": "312.00",
    "img": "bg07_wrsdxe",
    "category": "8"
  },
  "633": {
    "name": "academy marine",
    "price": "372.00",
    "img": "bg04_i3fq68",
    "category": "6"
  },
  "666": {
    "name": "husband wander",
    "price": "381.00",
    "img": "bg05_osoyo0",
    "category": "9"
  },
  "744": {
    "name": "glasses salmon",
    "price": "356.00",
    "img": "bg06_gmmeqj",
    "category": "3"
  },
  "777": {
    "name": "overeat duck",
    "price": "362.00",
    "img": "bg02_komziq",
    "category": "1"
  },
  "855": {
    "name": "whisper porter",
    "price": "371.00",
    "img": "bg01_mog1lh",
    "category": "2"
  },
  "1111": {
    "name": "chapter betray",
    "price": "442.00",
    "img": "bg10_coyfml",
    "category": "1"
  },
  "5222": {
    "name": "soprano maze",
    "price": "412.00",
    "img": "bg07_wrsdxe",
    "category": "5"
  },
  "6333": {
    "name": "attract pot",
    "price": "472.00",
    "img": "bg04_i3fq68",
    "category": "4"
  },
  "6666": {
    "name": "inflate salad",
    "price": "481.00",
    "img": "bg05_osoyo0",
    "category": "0"
  },
  "7444": {
    "name": "channel sight",
    "price": "456.00",
    "img": "bg06_gmmeqj",
    "category": "3"
  },
  "7777": {
    "name": "fashion lazy",
    "price": "462.00",
    "img": "bg02_komziq",
    "category": "0"
  },
  "8555": {
    "name": "recycle manage",
    "price": "471.00",
    "img": "bg01_mog1lh",
    "category": "7"
  },
  "8888": {
    "name": "adviser class",
    "price": "431.00",
    "img": "bg03_tdlabn",
    "category": "1"
  },
  "9999": {
    "name": "serious heal",
    "price": "419.00",
    "img": "bg08_hsajsa",
    "category": "0"
  },
  "22222": {
    "name": "partner drama",
    "price": "512.00",
    "img": "bg07_wrsdxe",
    "category": "2"
  },
  "33333": {
    "name": "density chief",
    "price": "572.00",
    "img": "bg04_i3fq68",
    "category": "4"
  },
  "44444": {
    "name": "drawing seller",
    "price": "556.00",
    "img": "bg06_gmmeqj",
    "category": "3"
  },
  "55555": {
    "name": "musical pair",
    "price": "571.00",
    "img": "bg01_mog1lh",
    "category": "2"
  },
  "66666": {
    "name": "wrestle ditch",
    "price": "581.00",
    "img": "bg05_osoyo0",
    "category": "7"
  },
  "77777": {
    "name": "kinship oppose",
    "price": "562.00",
    "img": "bg02_komziq",
    "category": "0"
  },
  "88888": {
    "name": "offense panel",
    "price": "531.00",
    "img": "bg03_tdlabn",
    "category": "1"
  },
  "00": {
    "name": "produce retire",
    "price": "242.00",
    "img": "bg09_hjz6no",
    "category": "2"
  },
  "000": {
    "name": "bathtub shrink",
    "price": "342.00",
    "img": "bg09_hjz6no",
    "category": "2"
  },
  "0000": {
    "name": "address cousin",
    "price": "442.00",
    "img": "bg09_hjz6no",
    "category": "2"
  }
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
