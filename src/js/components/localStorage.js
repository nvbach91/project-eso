App.saveLocalCart = () => {
  localStorage.cart = JSON.stringify(App.cart || {});
};

App.loadLocalCart = () => {
  App.cart = JSON.parse(localStorage.cart || '{}');
};

App.loadLocalStorage = () => {
  App.loadLocalCart();
};