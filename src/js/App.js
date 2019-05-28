require('./config.js');
require('./utils.js');
require('./components/network.js');
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

App.render = () => {
  App.renderModal();
  App.renderSpinner();
  App.renderHeader();
  App.renderFooter();
  App.renderMain();
};

App.init = () => {
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
    App.jOrderPreview = $('<div>');
    App.jTotal = $('<div>');
    App.jItemsCount = $('<div>');
    App.preloadImages(Object.values(App.products).map(p => p.img));
    App.render();
    moment.locale(App.locale);
  });
};
