
require('../common/config.js');
require('../common/lang/cs.js');
require('../common/lang/en.js');
require('../common/utils.js');
require('../common/auth.js');
require('../common/localStorage.js');
require('../common/network.js');
require('../common/receipt.js');
require('../common/form.js');
require('./components/header.js');
require('./components/main.js');
require('./screens/registrationScreen.js');

App.render = () => {
  App.renderHeader(App.createLocaleSwitcher({ direction: 'dropdown' }));
  App.renderMain();
};

App.init = () => {
  App.initErrorHandling();
  App.loadLocalStorage();
  App.loadLocale();
  App.jContainer = $('#app');
  App.jSpinner = $('#spinner');
  App.jModal = $('#modal');
  App.renderSpinner();
  App.renderModal();
  $.cloudinary.config({ cloud_name: App.cloudinaryCloudName, secure: true });
  App.start();
};

App.start = () => {
  App.jHeader = $('<header id="header">').appendTo(App.jContainer);
  App.jMain = $('<main id="main">').appendTo(App.jContainer);
  App.jFooter = $('<footer id="footer">').appendTo(App.jContainer);
  App.loadLocale();
  moment.locale(App.locale);
  App.render();
};
