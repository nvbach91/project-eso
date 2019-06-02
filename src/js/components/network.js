App.transactions = [];
App.products = {};
App.groups = {};
App.vatMarks = {};
App.settings = {};

App.attachToken = (xhr) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  }
};

App.fetchSettings = () => {
  return $.get({
    url: App.apiPrefix + '/settings',
    beforeSend: App.attachToken,
  }).done((resp) => {
    App.settings = resp;
    App.settings.vatRates.forEach((vatRate, index) => {
      App.vatMarks[vatRate] = String.fromCharCode(index + 65);
    });
  });
};

App.fetchProducts = () => {
  return $.get({
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
    url: App.apiPrefix + '/groups',
    beforeSend: App.attachToken,
  }).done((resp) => {
    resp.forEach((group) => {
      App.groups[group.number] = group;
    });
  });
};

App.fetchLastTransaction = () => {
  return $.get({
    url: App.apiPrefix + '/transactions/last',
    beforeSend: App.attachToken,
  }).done((resp) => {
    return resp;
  }).catch(() => {
    return App.getLastTransaction();
  });
};

App.connect = () => {
  return $.when(
    App.fetchSettings(),
    App.fetchProducts(),
    App.fetchCategories()
  );
};