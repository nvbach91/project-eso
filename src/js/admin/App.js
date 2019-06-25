
require('../common/config.js');
require('../common/lang/cs.js');
require('../common/lang/en.js');
require('../common/utils.js');
require('../common/auth.js');
require('../common/localStorage.js');
require('../common/network.js');
require('../common/receipt.js');
require('./screens/controlPanelScreen.js');
require('./screens/productsScreen.js');
require('./screens/groupsScreen.js');
require('./screens/transactionScreen.js');
require('./components/header.js');
require('./components/main.js');
require('./components/form.js');

App.render = () => {
  App.renderHeader();
  App.renderMain();
};

App.init = () => {
  App.loadLocalStorage();
  App.loadLocale();
  App.jContainer = $('#app');
  App.jSpinner = $('#spinner');
  App.jModal = $('#modal');
  App.renderSpinner();
  App.renderModal();
  App.renderLoginForm();
  //App.connect().then(() => {
  //  App.showProductEditForm('6333');
  //})
};

App.start = () => {
  App.connect().done(() => {
    App.jHeader = $('<header id="header">').appendTo(App.jContainer);
    App.jMain = $('<main id="main">').appendTo(App.jContainer);
    App.jFooter = $('<footer id="footer">').appendTo(App.jContainer);
    App.render();
    moment.locale(App.locale);
  });
};