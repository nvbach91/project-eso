const { default: axios } = require("axios");

App.transactions = [];
App.products = {};
App.groups = {};
App.mods = {};
App.modTypes = {};
App.productMods = {};
App.productCountByGroups = {};
App.vatMarks = {};
App.settings = {};
App.aggregates = {};
App.availableThemes = {};

$(document).ajaxStop(() => {
  App.hideSpinner();
});

$(document).ajaxStart(() => {
  App.showSpinner();
});

App.attachToken = (xhr) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  }
};

App.fetchSettings = () => {
  return $.get({
    url: `${App.apiPrefix}/settings`,
    beforeSend: App.attachToken,
  }).done((resp) => {
    App.settings = resp;
    App.settings.vatRates.forEach((vatRate, index) => {
      App.vatMarks[vatRate] = String.fromCharCode(index + 65);
    });
    
    App.availableThemes[App.settings.theme] = $('#theme').attr('href');
    $.get('/themes').done((res) => {
      App.availableThemes = res;
    });
  });
};

App.fetchProducts = () => {
  return $.get({
    url: `${App.apiPrefix}/products`,
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
    url: `${App.apiPrefix}/groups`,
    beforeSend: App.attachToken,
  }).done((resp) => {
    resp.forEach((item) => {
      App.groups[item.number] = item;
    });
  });
};

App.fetchMods = () => {
  return $.get({
    url: `${App.apiPrefix}/mods`,
    beforeSend: App.attachToken,
  }).done((resp) => {
    App.mods = {};
    App.modTypes = {};
    App.productMods = {};
    resp.forEach((mod) => {
      App.mods[mod.number] = mod;
      Object.keys(mod.eans).forEach((ean) => {
        if (!App.productMods[ean]) {
          App.productMods[ean] = [mod.number];
        } else {
          App.productMods[ean].push(mod.number);
        }
      });
      const type = mod.type;
      if (!App.modTypes[type]) {
        App.modTypes[type] = [mod.number];
      } else {
        App.modTypes[type].push(mod.number);
      }
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

App.saveProduct = (product, btn) => {
  App.ajaxSaving(btn);
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
    return App.fetchMods();
  }).done(App.ajaxSaveDone(btn)).fail(App.ajaxSaveFail(btn));
};

App.deleteProduct = (ean, btn) => {
  App.ajaxDeleting(btn);
  return $.ajax({
    type: 'DELETE',
    url: `${App.apiPrefix}/products/${ean}`,
    beforeSend: App.attachToken,
  }).done(() => {
    App.productCountByGroups[App.products[ean].group]--;
    delete App.products[ean];
    return App.fetchMods();
  }).done(App.ajaxDeleteDone(btn)).fail(App.ajaxDeleteFail(btn));
};

App.saveGroup = (group, btn) => {
  App.ajaxSaving(btn);
  return $.post({
    url: `${App.apiPrefix}/groups`,
    beforeSend: App.attachToken,
    contentType: 'application/json',
    data: JSON.stringify(group),
  }).done(() => {
    App.groups[group.number] = group;
  }).done(App.ajaxSaveDone(btn)).fail(App.ajaxSaveFail(btn));
};

App.deleteGroup = (number, btn) => {
  App.ajaxDeleting(btn);
  return $.ajax({
    type: 'DELETE',
    url: `${App.apiPrefix}/groups/${number}`,
    beforeSend: App.attachToken,
  }).done(() => {
    delete App.groups[number];
  }).done(App.ajaxDeleteDone(btn)).fail(App.ajaxDeleteFail(btn));
};

App.saveMod = (item, btn, done) => {
  App.ajaxSaving(btn);
  return $.post({
    url: `${App.apiPrefix}/mods`,
    beforeSend: App.attachToken,
    contentType: 'application/json',
    data: JSON.stringify(item),
  }).done(() => {
    return App.fetchMods().done(done);
    //App.mods[item.number] = item;
  }).done(App.ajaxSaveDone(btn)).fail(App.ajaxSaveFail(btn));
};

App.deleteMod = (number, btn, done) => {
  App.ajaxDeleting(btn);
  return $.ajax({
    type: 'DELETE',
    url: `${App.apiPrefix}/mods/${number}`,
    beforeSend: App.attachToken,
  }).done(() => {
    return App.fetchMods().done(done);
    //delete App.mods[number];
  }).done(App.ajaxDeleteDone(btn)).fail(App.ajaxDeleteFail(btn));
};

App.deleteSlide = (_id, btn) => {
  if (!_id) {
    return btn.parent().parent().remove();
  }
  App.ajaxDeleting(btn);
  return $.ajax({
    type: 'DELETE',
    url: `${App.apiPrefix}/slides/${_id}`,
    beforeSend: App.attachToken,
  }).done(() => {
    delete App.settings.slides[_id];
    btn.parent().parent().remove();
  }).done(App.ajaxDeleteDone(btn)).fail(App.ajaxDeleteFail(btn));
};

App.deletePrinter = (id, btn, type) => {
  App.ajaxDeleting(btn);
  return $.ajax({
    type: 'DELETE',
    url: `${App.apiPrefix}/settings/${type}/${id}`,
    beforeSend: App.attachToken,
  }).done(() => {
    delete App.settings[type][id];
    btn.parents('.card.printer').slideUp(function () {
      $(this).remove();
    });
  }).done(App.ajaxDeleteDone(btn)).fail(App.ajaxDeleteFail(btn));
};

App.connect = () => {
  return $.when(
    App.fetchSettings(),
    App.fetchProducts(),
    App.fetchGroups(),
    App.fetchMods()
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

App.deleteOrs = (btn) => {
  App.ajaxDeleting(btn);
  return $.ajax({
    type: 'DELETE',
    url: `${App.apiPrefix}/ors`,
    beforeSend: App.attachToken,
  }).done(() => {
    App.settings.ors = {};
  }).done(App.ajaxDeleteDone(btn)).fail(App.ajaxDeleteFail(btn));
};

App.deleteEmployee = (username, btn) => {
  App.ajaxDeleting(btn);
  return $.ajax({
    type: 'DELETE',
    url: `${App.apiPrefix}/employee`,
    data: { username },
    beforeSend: App.attachToken,
  }).done((resp) => {
    if (resp.msg !== 'srv_success') {
      return App.ajaxDeleteFail(btn)();
    }
    delete App.settings.employees[username.split(':')[1]];
    btn.parent().parent().remove();
    App.ajaxDeleteDone(btn)();
  }).fail(App.ajaxDeleteFail(btn));
};
