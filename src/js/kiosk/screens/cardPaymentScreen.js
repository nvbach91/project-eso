App.ptSend = (ptRequest) => {
  return $.post({
    url: App.settings.terminal.endpoint,
    dataType: 'json',
    data: ptRequest,
  });
};

App.ptPay = (amount, currency, customerLanguage, receiptNumber) => {
  const ptRequest = {
    transactionType: 'sale',
    ip: App.settings.terminal.ip,
    port: App.settings.terminal.port,
    amount: amount,
    currency: currency,
    customerLanguage: customerLanguage,
    referenceNumber: receiptNumber.toString(),
    password: App.settings.terminal.password
  };
  return App.ptSend(ptRequest);
};

App.renderCardPaymentScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="screen payment-methods">
        <div class="card full-width-card">
          <h5 class="card-header">${App.lang.card_payment_title}</h5>
          <div class="card-body">
            <p>${App.lang.card_payment_desc}</p>
          </div>
        </div>
      </div>
    </main>
  `);
  const inlineSpinner = App.createInlineSpinner();
  screen.find('.card-body').append(inlineSpinner);
  screen.find('.card').hide();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.find('.card').slideDown(App.getAnimationTime());

  const { totalPrice } = App.calculateCartSummaryValues();
  App.fetchTransactions(0, 1).then((transactions) => {
    if (transactions.length) {
      return transactions[0];
    }
    return App.getLastTransaction();
  }).then((lastTransaction) => {
    const newTransactionNumber = App.createNewTransactionNumber(lastTransaction);
    App.ptPay(totalPrice.formatMoney(), App.settings.currency.code, App.locale, newTransactionNumber).done((resp) => {
      if (resp.msg && /^(R00\d|R010)$/.test(resp.msg.responseCode)) {
        const appendix = resp.msg.dataFields.t;
        App.createTransaction().done((resp) => {
          App.renderFinishScreen();
          App.transactions.push(resp);
          App.printKitchenReceipt(resp);
          App.printLabelReceipt(resp);
          if (App.settings.tablesync.url) {
            App.sendOrderToTableSync(resp);
          }
          App.printKioskReceipt(resp, appendix);
        }).fail((resp) => {
          App.showWarning(`
            <p>${App.lang.modal_payment_failed_p1} (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p>
            <p>${App.lang.modal_payment_failed_p2}</p>
          `);
        });
      } else {
        App.showWarning(`
          <p>${App.lang.modal_payment_failed_p1}</p>
          ${resp.msg ? `<p><strong>${`${resp.msg.responseCode || ''} ${resp.msg.responseMessage || ''}`}</strong></p>` : ''}
          <p>${App.lang.modal_payment_failed_p2}</p>
        `);
        App.renderCheckoutScreen();
      }
    }).fail((resp) => {
      App.showWarning(`
        <p>${App.lang.modal_payment_failed_p1}</p>
        ${resp.msg ? `<p><strong>${`${resp.msg.responseCode || ''} ${resp.msg.responseMessage || ''}`}</strong></p>` : ''}
        <p>${App.lang.modal_payment_failed_p2}</p>
      `);
      App.renderCheckoutScreen();
    }).always(() => {
      inlineSpinner.remove();
    });
    App.hideSpinner();
  });

  App.hideSpinner();
};

App.payInCash = () => {
  App.createTransaction().done((resp) => {
    App.renderFinishScreen();
    App.transactions.push(resp);
    App.printKitchenReceipt(resp);
    App.printLabelReceipt(resp);
    if (App.settings.tablesync.url) {
      App.sendOrderToTableSync(resp);
    }
    App.printKioskReceipt(resp);
  }).fail((resp) => {
    App.showWarning(`
      <p>${App.lang.modal_payment_failed_p1} (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p>
      <p>${App.lang.modal_payment_failed_p2}</p>
    `);
  });
};

App.sendOrderToTableSync = (resp) => {
  // console.log(resp.items);
  try {
    const orderData = resp.items.map((item) => ({
      id: App.generateRandomPassword(),
      _id: App.generateRandomPassword(),
      ean: item.ean,
      quantity: item.quantity,
      price: item.price,
      tax: item.vat,
      name: App.products[item.ean].name,
      group: item.group.toString(),
      printed: true,
      name2: '',
      note: item.mods.map((mod) => `*${parseFloat(mod.price) ? ` ${mod.quantity}x` : ''} ${App.mods[mod.number].name}`).join('<br>'),
      mods: '',
    }));
    const order = {
      number: resp.number,
      mask: `${App.settings.receipt.orderPrefix}${resp.order}`,
      date: resp.date,
      username: App.user.username,
      status: 'pending',
      paid: true,
      receipt: resp.number,
      tableId: App.generateRandomPassword(16),
      tableName: 'KIOSK',
      online: true,
    };
    order.data = JSON.stringify(orderData);
    $.ajax({
      method: 'POST',
      url: `${App.settings.tablesync.url}/order`,
      data: order,
    }).done(() => {
      // console.log('Your order was successfully placed');
    }).fail(() => {
      App.showWarning(`
        <p>Your order <strong>#${order.mask}</strong> was not successfully placed, please contact staff</p>
        <p>Vaše objednávka <strong>#${order.mask}</strong> nebyla úspěšně založena, prosím kontaktujte obsluhu</p>
      `);
    });
  } catch (e) {
    $.ajax({
      url: '/secret/errors',
      method: 'POST',
      data: { err_msg: e, err_stack: e ? e.stack : '', user: `${App.user ? App.user.username : 'undefined'} caught in sendOrderToTableSync` },
    });
    $.ajax({
      url: '/secret/errors',
      method: 'POST',
      data: { err_msg: 'dispatching error event in sendOrderToTableSync', user: `${App.user ? App.user.username : 'undefined'}` },
    });
    window.dispatchEvent(new ErrorEvent('error', { error: e, message: e }));
  }
};