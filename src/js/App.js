require('./config.js');
require('./utils.js');
require('./components/auth.js');
require('./components/network.js');
require('./components/localStorage.js');
require('./screens/standbyScreen.js');
require('./screens/orderScreen.js');
require('./screens/checkoutScreen.js');
require('./screens/diningChoiceScreen.js');
require('./screens/cardPaymentScreen.js')
require('./screens/finishScreen.js');
require('./screens/controlPanelScreen.js');
require('./screens/cp_screens/pluArticlesScreen.js');
require('./components/header.js');
require('./components/main.js');
require('./components/footer.js');
require('./components/cart.js');
require('./components/receipt.js');
require('./components/cpTabs.js');
require('./lang/cs.js');
require('./lang/en.js');

$(document).ajaxStop(() => {
  App.hideSpinner();
});

$(document).ajaxStart(() => {
  App.showSpinner();
});

App.render = () => {
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
  App.jContainer = $('#app');
  App.jSpinner = $('#spinner');
  App.jModal = $('#modal');
  App.renderSpinner();
  App.renderModal();
  App.renderLoginForm();
};

App.start = () => {
  App.connect().done(() => {
    App.paymentMethod = 'card';
    App.jHeader = $('<header id="header">').appendTo(App.jContainer);
    App.jMain = $('<main id="main">').appendTo(App.jContainer);
    App.jFooter = $('<footer id="footer">').appendTo(App.jContainer);
    App.jOrderPreview = $('<div>');
    App.jTotal = $('<div>');
    App.jItemsCount = $('<div>');
    App.preloadImages(Object.values(App.products).map(p => p.img));
    App.render();
    moment.locale(App.locale);
  });
};