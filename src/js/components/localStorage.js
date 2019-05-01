App.saveLocalCart = () => {
  localStorage.cart = JSON.stringify(App.cart || {});
  localStorage.cartCategoryQuantities = JSON.stringify(App.cartCategoryQuantities || {});
};

App.loadLocalCart = () => {
  App.cart = JSON.parse(localStorage.cart || '{}');
  App.cartCategoryQuantities = JSON.parse(localStorage.cartCategoryQuantities || '{}');
};

App.loadLocalStorage = () => {
  App.loadLocalCart();
};