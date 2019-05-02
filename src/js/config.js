const App = {};
window.App = App;
App.imageUrlBase = 'https://res.cloudinary.com/ceny24/image/upload/';

App.localhostPort = window.location.protocol === 'https:' ? 2443 : 2080;
App.localhostServerURL = window.location.protocol + '//localhost:' + App.localhostPort;
App.tableSyncServerURL = window.location.protocol + '//sync.vcap.me:' + App.localhostPort;
