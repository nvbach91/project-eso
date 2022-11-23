const App = {};
window.App = App;
App.apiPrefix = '/api/v1';
App.cloudinaryCloudName = 'itakecz';
App.imageUrlBase = `https://res.cloudinary.com/${App.cloudinaryCloudName}/image/upload/`;

App.paymentTerminalServerURL = `${window.location.protocol}//localhost:3443`;
App.localhostServerURL = `${window.location.protocol}//localhost:2443`;
App.tableSyncServerURL = `${window.location.protocol}//sync.vcap.me:2443`;

App.paymentTerminalTypesByPort = {
  '2050': 'payment-terminal-ingenico',
  '20008': 'payment-terminal-pax',
};

const [ subdomain, domain, realm ] = window.location.hostname.split('.');
App.subdomain = subdomain;
App.domain = domain;
App.realm = realm;

App.provider = 'Ethereals United';

App.origin = `www.itake.cz`;

App.credits = `${new Date().getFullYear()} © ${App.origin}`;

App.supportedCurrencies = {
  CZK: {
    code: 'CZK',
    locale: 'cs',
    rounding: true,
    symbol: 'Kč'
  },
  //EUR: '€'
};

App.supportedLocales = {
  'en': 'English',
  'cs': 'Čeština',
  // 'sk': 'Slovenčina',
  // 'vi': 'tiếng Việt',
  // 'ko': '한국어',
  // 'ja': '日本語',
  // 'de': 'Deutsch',
};

App.datePickerInstances = [];

App.formats = {
  date: 'DD.MM.YYYY',
  dateTime: 'DD.MM.YYYY HH:mm:ss',
  dayDateTime: 'dddd DD.MM.YYYY HH:mm:ss',
  datePrefix: 'YYYYMMDD',
};

App.supportedPrinters = [ // will change after call to local api for active printers
  '',
  'EPSON TM-T20II Receipt',
  'EPSON TM-T20II Receipt5',
  'BP003',
  'POS80 Printer',
  'PRP-085',
  'BP-T3',
  'XP-58',
  'XP-58C',
  'XP-80',
  'XP-80',
];

App.debounceTime = 300;

App.configure = () => {
  Chart.defaults.global.defaultFontFamily = 'Open Sans';
};
