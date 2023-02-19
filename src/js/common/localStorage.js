App.saveLocalCart = () => {
  localStorage.setItem('cart', JSON.stringify(App.cart || {}));
  localStorage.setItem('cartCategoryQuantities', JSON.stringify(App.cartCategoryQuantities || {}));
};

App.saveLocalPreference = (key, value) => {
  App[key] = value;
  localStorage[key] = value;
};

App.loadLocalStorage = () => {
  App.cart = JSON.parse(localStorage.getItem('cart') || '{}');
  App.cartCategoryQuantities = JSON.parse(localStorage.getItem('cartCategoryQuantities') || '{}');
  App.locale = localStorage.getItem('locale') || App.detectBrowserLanguage();
  App.offlineTransactions = JSON.parse(localStorage.getItem('offlineTransactions') || '[]');
};
