App.products = {};
App.categories = {};
App.taxMarks = {};
App.settings = {};

App.fetchSettings = () => {
  return $.get('/api/v1/settings').done((resp) => {
    App.settings = resp;
    App.settings.taxRates.forEach((taxRate, index) => {
      App.taxMarks[taxRate] = String.fromCharCode(index + 65);
    });
  });
};

App.fetchProducts = () => {
  return $.get('/api/v1/products').done((resp) => {
    resp.forEach((product) => {
      App.products[product.ean] = product;
    });
  });
};

App.fetchCategories = () => {
  return $.get('/api/v1/categories').done((resp) => {
    resp.forEach((category) => {
      App.categories[category.number] = category;
    });
  });
};

App.connect = () => {
  return $.when(
    App.fetchSettings(),
    App.fetchProducts(),
    App.fetchCategories()
  );
};