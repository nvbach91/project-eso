const App = {};
window.App = App;
App.apiPrefix = '/api/v1';
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

App.pikadayInstances = [];

App.formats = {
  date: 'DD.MM.YYYY',
  dateTime: 'DD.MM.YYYY HH:mm:ss',
  dayDateTime: 'dddd DD.MM.YYYY HH:mm:ss',
  datePrefix: 'YYYYMMDD',
};

App.debounceTime = 300;