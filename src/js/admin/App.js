
require('../common/config.js');
require('../common/lang/cs.js');
require('../common/lang/en.js');
require('../common/utils.js');
require('../common/auth.js');
require('../common/localStorage.js');
require('../common/network.js');
require('../common/receipt.js');
require('../common/form.js');
require('./screens/controlPanelScreen.js');
require('./screens/productsScreen.js');
require('./screens/modsScreen.js');
require('./screens/groupsScreen.js');
require('./screens/companyScreen.js');
require('./screens/kioskScreen.js');
require('./screens/peripheralsScreen.js');
require('./screens/transactionScreen.js');
require('./screens/dashboardScreen.js');
require('./components/header.js');
require('./components/main.js');

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
  App.renderLoginForm();
  $.getJSON(`${App.localhostServerURL}/activeprinters`).done((resp) => App.supportedPrinters = ['', ...resp.msg]);
  $.cloudinary.config({ cloud_name: App.cloudinaryCloudName, secure: true });

  //$('.form-signin').submit();
  //App.connect();
};

App.start = () => {
  App.connect().done(() => {
    App.jHeader = $('<header id="header">').appendTo(App.jContainer);
    App.jMain = $('<main id="main">').appendTo(App.jContainer);
    App.jFooter = $('<footer id="footer">').appendTo(App.jContainer);
    App.jAlert = $(`
      <div class="alert alert-dismissible">
        <button class="close">&times;</button>
        <span></span>
      </div>
    `).hide().appendTo(App.jContainer);
    App.jAlert.find('button.close').click(() => App.jAlert.hide());
    App.loadLocale();
    App.render();
    moment.locale(App.locale);
  });
};