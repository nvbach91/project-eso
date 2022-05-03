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
      if (resp.msg && /^R00\d|R010$/.test(resp.msg.responseCode)) {
        const appendix = resp.msg.dataFields.t;
        App.renderFinishScreen();
        App.createTransaction().done((resp) => {
          App.transactions.push(resp);
          App.printReceipt(resp, appendix);
          App.printKitchenReceipt(resp);
          App.printLabelReceipt(resp);
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
    App.printReceipt(resp);
    App.printKitchenReceipt(resp);
    App.printLabelReceipt(resp);
    if (App.socket) {
      const emitData = {};
      emitData[App.generateRandomPassword()] = {
        number: resp.number,
        date: resp.date,
        data: resp.items.map((item) => ({
          id: App.generateRandomPassword(),
          _id: App.generateRandomPassword(),
          ean: item.ean,
          quantity: item.quantity,
          price: item.price,
          printed: false,
          group: item.group.toString(),
          name: App.products[item.ean].name,
          name2: '',
          notes: item.mods.map((m) => App.mods[m.number].name).join(' | '),
          mods: '',
        })),
        items: '',
        username: App.user.username,
        tableName: '',
        mask: resp.order,
        bistro: true
      };
      // console.log(resp);
      // console.log(emitData);
      App.socket.emit('server:table-sync', emitData);
    }
  }).fail((resp) => {
    App.showWarning(`
      <p>${App.lang.modal_payment_failed_p1} (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p>
      <p>${App.lang.modal_payment_failed_p2}</p>
    `);
  });
};
