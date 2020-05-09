require('../common/config.js');
require('../common/lang/cs.js');
require('../common/lang/en.js');
require('../common/utils.js');
require('../common/auth.js');
require('../common/localStorage.js');
require('../common/network.js');
require('../common/receipt.js');
require('./screens/standbyScreen.js');
require('./screens/orderScreen.js');
require('./screens/checkoutScreen.js');
require('./screens/deliveryMethodScreen.js');
require('./screens/cardPaymentScreen.js')
require('./screens/finishScreen.js');
require('./components/header.js');
require('./components/main.js');
require('./components/footer.js');
require('./components/cart.js');
require('./components/tabs.js');
require('./components/products.js');


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
    App.loadLocale();
    App.render();
    moment.locale(App.locale);
  });
};

(() => {
  const beforePrint = () => {
    // console.log('Functionality to run before printing.');
  };
  const afterPrint = () => {
    App.closeModal();
  };
  if (window.matchMedia) {
    const mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener((mql) => {
      if (mql.matches) {
        beforePrint();
      } else {
        afterPrint();
      }
    });
  }
  window.onbeforeprint = beforePrint;
  window.onafterprint = afterPrint;
})();
