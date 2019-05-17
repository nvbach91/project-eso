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

App.langUpdate = () => {
  App.offerCard = {
    'title': App.lang.dining_choice_welcome_title,  
    'btn': App.lang.dining_choice_special_offer_btn
  };
  App.diningChoice = {
    'eat-in': { 
      title: App.lang.dining_choice_eat_in_title,
      text: App.lang.dining_choice_eat_in_text,
      btn: { text: App.lang.dining_choice_eat_in_btn, class: 'btn-primary' },
      img: 'https://media1.s-nbcnews.com/j/streams/2014/October/141006/2D274906938828-today-cafeteria-140811-01.fit-760w.jpg',
    },
    'take-out': { 
      title: App.lang.dining_choice_take_out_title,
      text: App.lang.dining_choice_take_out_text,
      btn: { text: App.lang.dining_choice_take_out_btn, class: 'btn-warning' },
      img: 'https://www.sld.com/wp-content/uploads/2017/03/1280x480RestaurantTakeOut.jpg',
    },
  };
  App.orderScreen = {
    'checkout': App.lang.order_checkout_btn,
    'order': App.lang.order_products_order_btn
  }
}

App.render = () => {
  App.renderModal();
  App.renderSpinner();
  App.renderHeader();
  App.renderFooter();
  App.renderMain();
};

App.init = () => {
  App.lang = App.GLocaleEN;
  App.langUpdate();
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
