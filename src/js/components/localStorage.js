App.saveLocalCart = () => {
  localStorage.cart = JSON.stringify(App.cart || {});
  localStorage.cartCategoryQuantities = JSON.stringify(App.cartCategoryQuantities || {});
};

App.saveLocalPreference = (key, value) => {
  App[key] = value;
  localStorage[key] = value;
};

App.loadLocalStorage = () => {
  App.cart = JSON.parse(localStorage.cart || '{}');
  App.cartCategoryQuantities = JSON.parse(localStorage.cartCategoryQuantities || '{}');
  
  App.locale = localStorage.locale || App.detectBrowserLanguage();
};