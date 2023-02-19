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
require('./screens/tableMarkersScreen.js');
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

App.initOfflineTransactionSync = () => {
  let isSyncing = false;
  const onAfterSync = (syncedTransactionsNumbers) => {
    if (syncedTransactionsNumbers.length) {
      App.offlineTransactions = App.offlineTransactions.filter((offlineTransaction) => {
        return !syncedTransactionsNumbers.includes(offlineTransaction.number);
      });
      localStorage.setItem('offlineTransactions', JSON.stringify(App.offlineTransactions));
    }
    isSyncing = false;
  };
  setInterval(() => {
    if (Offline.state === 'down' || isSyncing || !App.offlineTransactions.length) {
      return false;
    }
    isSyncing = true;
    const syncedTransactionsNumbers = [];
    Promise.each(App.offlineTransactions, (transaction) => {
      return $.post({
        url: `${App.apiPrefix}/transactions`,
        beforeSend: App.attachToken,
        contentType: 'application/json',
        data: JSON.stringify(transaction),
      }).done(() => {
        syncedTransactionsNumbers.push(transaction.number);
      }).fail((resp) => {
        if (resp.responseJSON && resp.responseJSON.msg === 'srv_transaction_number_already_exists') {
          syncedTransactionsNumbers.push(transaction.number);
        }
      });
    }).then(() => {
      onAfterSync(syncedTransactionsNumbers);
    }).catch(() => {
      onAfterSync(syncedTransactionsNumbers);
    });
  }, 10000);
};

App.render = () => {
  App.renderHeader();
  App.renderFooter();
  App.renderMain();
};

App.init = () => {
  Offline.options = { requests: false, checks: { xhr: {url: '/ping' } } };
  navigator.connection.onchange = () => {
    Offline.check();
  };
  App.initErrorHandling();
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
    App.initOfflineTransactionSync();
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
