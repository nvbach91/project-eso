App.transactions = [];
App.products = {};
App.groups = {};
App.productCountByGroups = {};
App.vatMarks = {};
App.settings = {};
App.aggregates = {};

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
    App.settings.currencySymbol = App.supportedCurrencies[resp.currency];
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
      if (typeof App.productCountByGroups[product.group] !== 'number') {
        App.productCountByGroups[product.group] = 1;
      } else {
        App.productCountByGroups[product.group]++;
      }
    });
  });
};

App.fetchGroups = () => {
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
    url: `${App.apiPrefix}/transactions/page/${offset || 0}/${limit || 100}`,
    beforeSend: App.attachToken,
  });
};

App.fetchTransactionsByDatePrefix = (date) => {
  const datePrefix = moment(date || new Date()).format(App.formats.datePrefix);
  return $.get({
    url: `${App.apiPrefix}/transactions/date/${datePrefix}`,
    beforeSend: App.attachToken,
  }).then((resp) => {
    return resp.sort((a, b) => b.number - a.number);
  });
};

App.saveProduct = (product) => {
  const originalProduct = App.products[product.ean];
  if (originalProduct) {
    App.productCountByGroups[originalProduct.group]--;
  }
  return $.post({
    url: `${App.apiPrefix}/products`,
    beforeSend: App.attachToken,
    contentType: 'application/json',
    data: JSON.stringify(product),
  }).done(() => {
    App.products[product.ean] = product;
    App.productCountByGroups[product.group]++;
  });
};

App.deleteProduct = (ean) => {
  return $.ajax({
    type: 'DELETE',
    url: `${App.apiPrefix}/products/${ean}`,
    beforeSend: App.attachToken,
  }).done(() => {
    delete App.products[ean];
  });
};

App.saveGroup = (group) => {
  return $.post({
    url: `${App.apiPrefix}/groups`,
    beforeSend: App.attachToken,
    contentType: 'application/json',
    data: JSON.stringify(group),
  }).done(() => {
    App.groups[group.number] = group;
  });
};

App.deleteGroup = (groupNumber) => {
  return $.post({
    type: 'DELETE',
    url: `${App.apiPrefix}/groups/${groupNumber}`,
    beforeSend: App.attachToken,
  }).done(() => {
    delete App.groups[groupNumber];
  });
};

App.connect = () => {
  return $.when(
    App.fetchSettings(),
    App.fetchProducts(),
    App.fetchGroups()
  );
};

App.fetchAggregates = (start, end) => {
  const startPrefix = moment(start || new Date()).format(App.formats.datePrefix);
  const endPrefix = moment(end || new Date()).format(App.formats.datePrefix);
  return $.get({
    url: `${App.apiPrefix}/aggregates/all/${startPrefix}/${endPrefix}`,
    beforeSend: App.attachToken,
  }).done((resp) => {
    App.aggregates = resp;
  });
};
