require('./config.js');
require('./utils.js');
require('./components/localStorage.js');
require('./screens/standbyScreen.js');
require('./screens/orderScreen.js');
require('./screens/checkoutScreen.js');
require('./screens/diningChoiceScreen.js');
require('./screens/cardPaymentScreen.js')
require('./screens/finishScreen.js');
require('./components/header.js');
require('./components/main.js');
require('./components/footer.js');
require('./components/cart.js');
require('./components/receipt.js');
require('./lang/cs.js');
require('./lang/en.js');

App.connect = () => {
  App.taxMarks = {};
  App.settings.taxRates.forEach((taxRate, index) => {
    App.taxMarks[taxRate] = String.fromCharCode(index + 65);
  });
  return $.when();
};

App.render = () => {
  App.renderModal();
  App.renderSpinner();
  App.renderHeader();
  App.renderFooter();
  App.renderMain();
};

App.init = () => {
  App.lang = App.GLocaleCS;
  console.log(App.lang);
  App.loadLocalStorage();
  App.loadLocale();
  App.activeTabPosition = 0;
  App.currentSlidePosition = 0;
  App.activityCheckInterval = 0;
  App.isCheckingActivity = false;
  App.connect().done(() => {
    App.paymentMethod = 'card';
    App.jContainer = $('#app');
    App.jHeader = $('#header');
    App.jMain = $('#main');
    App.jFooter = $('#footer');
    App.jSpinner = $('#spinner');
    App.jModal = $('#modal');
    App.render();
    moment.locale(App.locale);
  });
};
