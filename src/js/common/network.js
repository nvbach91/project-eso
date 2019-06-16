App.transactions = [];
App.products = {};
App.groups = {};
App.vatMarks = {};
App.settings = {};

$(document).ajaxStop(() => {
  App.hideSpinner();
});

$(document).ajaxStart(() => {
  App.showSpinner();
});

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

App.fetchTransactions = (offset, limit) => {
  return $.get({
    url: `${App.apiPrefix}/transactions/${offset || 0}/${limit || 100}`,
    beforeSend: App.attachToken,
  }).done((resp) => {
    return resp;
  });
};

App.connect = () => {
  return $.when(
    App.fetchSettings(),
    App.fetchProducts(),
    App.fetchCategories()
  );
};