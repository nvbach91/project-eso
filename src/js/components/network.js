App.products = {};
App.categories = {};
App.taxMarks = {};
App.settings = {};

App.attachToken = (xhr) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  }
};

App.fetchSettings = () => {
  return $.ajax({
    type: 'GET',
    url: App.apiPrefix + '/settings',
    beforeSend: App.attachToken,
  }).done((resp) => {
    App.settings = resp;
    App.settings.taxRates.forEach((taxRate, index) => {
      App.taxMarks[taxRate] = String.fromCharCode(index + 65);
    });
  });
};

App.fetchProducts = () => {
  return $.ajax({
    type: 'GET',
    url: App.apiPrefix + '/products',
    beforeSend: App.attachToken,
  }).done((resp) => {
    resp.forEach((product) => {
      App.products[product.ean] = product;
    });
  });
};

App.fetchCategories = () => {
  return $.get({
    type: 'GET',
    url: App.apiPrefix + '/categories',
    beforeSend: App.attachToken,
  }).done((resp) => {
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