App.ptSend = (ptRequest) => {
  return $.post({
    url: App.settings.terminal.endpoint,
    dataType: 'json',
    data: ptRequest,
  });
};

App.ptPassivate = () => {
  const ptRequest = {
    transactionType: 'passivate',
    ip: App.settings.terminal.ip,
    port: App.settings.terminal.port,
    password: App.settings.terminal.password,
  };
  return App.ptSend(ptRequest);
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
    password: App.settings.terminal.password,
  };
  return App.ptSend(ptRequest);
};

App.renderCardPaymentScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="screen payment-methods">
        <div class="card full-width-card">
          <div class="card-header">
            <h5>${App.lang.card_payment_title}</h5>
            ${App.settings.terminal.type === 'payment-terminal-pax-csob' ? (`
              <button class="btn btn-danger cancel-card-payment" style="display: none">
                ${App.lang.card_payment_cancel}
              </button>
            `) : ''}
          </div>
          <div class="card-body">
            <h4 class="text-center">${App.lang.card_payment_desc}</h4>
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
  App.fetchTransactions({ offset: 0, limit: 1 }).done((transactions) => {
    const lastTransaction = transactions.length ? transactions[0] : App.getLastTransaction();
    const newTransactionNumber = App.createNewTransactionNumber(lastTransaction);
    App.isProcessingCardPayment = true;
    App.ptPay(totalPrice.formatMoney(), App.settings.currency.code, App.locale, newTransactionNumber).done((resp) => {
      if (resp.msg && /^(R00\d|R010)$/.test(resp.msg.responseCode)) {
        const appendix = resp.msg.dataFields.t;
        let nTries = 0;
        const tryToCreateTransaction = (isCreatingOfflineOrder) => {
          if (nTries >= 3 && !isCreatingOfflineOrder) {
            // return console.log(nTries);
            return tryToCreateTransaction(true)
          }
          App.createTransaction(newTransactionNumber, isCreatingOfflineOrder).done((resp) => {
            App.renderFinishScreen(resp);
            App.transactions.push(resp);
            App.printKitchenReceipt(resp);
            App.printLabelReceipt(resp);
            if (App.settings.tablesync.url) {
              App.showSpinner();
              App.sendOrderToTableSync(resp).done(() => {
                App.hideSpinner();
              });
            }
            App.printKioskReceipt(resp, appendix);
          }).always(() => {
            nTries++;
          }).fail((resp) => {
            if (resp.status !== 0) {
              return tryToCreateTransaction(true);
            }
            setTimeout(() => {
              tryToCreateTransaction();
            }, 3000);
          });
        };
        tryToCreateTransaction();
      } else {
        App.showWarning(`
          <h4 class="text-center">${App.lang.modal_payment_failed_p1}</h4>
          ${resp.msg && resp.msg.responseCode ? `<h5 class="text-center"><strong class="badge badge-danger">${`${resp.msg.responseCode || ''} ${resp.msg.responseMessage || ''}`}</strong></h5>` : ''}
          <h5 class="text-center">${App.lang.modal_payment_failed_p2}</h5>
        `);
        App.renderCheckoutScreen();
      }
    }).fail((resp) => {
      App.warnPaymentFailed(resp);
      App.renderCheckoutScreen();
    }).always(() => {
      App.isProcessingCardPayment = false;
    });
  }).fail((resp) => {
    App.warnPaymentFailed(resp);
    App.renderCheckoutScreen();
  });
  const cancelCardPaymentButton = screen.find('.cancel-card-payment');
  if (cancelCardPaymentButton.length) {
    cancelCardPaymentButton.click(() => {
      App.ptPassivate();
    });
    // show cancel card payment button
    // setTimeout(() => {
    //   cancelCardPaymentButton.show();
    // }, 10000);
  }
  App.hideSpinner();
};

App.payInCash = () => {
  App.fetchTransactions({ offset: 0, limit: 1 }).done((transactions) => {
    const lastTransaction = transactions.length ? transactions[0] : App.getLastTransaction();
    const newTransactionNumber = App.createNewTransactionNumber(lastTransaction);
    App.createTransaction(newTransactionNumber).done((resp) => {
      App.renderFinishScreen(resp);
      App.transactions.push(resp);
      App.printKitchenReceipt(resp);
      App.printLabelReceipt(resp);
      if (App.settings.tablesync.url) {
        App.sendOrderToTableSync(resp);
      }
      App.printKioskReceipt(resp);
    }).fail(App.warnPaymentFailed); // App.createTransaction might fall immediately after App.fetchTransaction?
  }).fail(App.warnPaymentFailed);
};

App.warnPaymentFailed = (resp) => {
  console.log(resp);
  App.showWarning(`
    <h4 class="text-center">${App.lang.modal_payment_failed_p1}</h4>
    <div class="text-center">${resp.statusText}: ${resp.status} ${resp.responseJSON ? `, ${resp.responseJSON.msg || JSON.stringify(resp.responseJSON)}` : ''}</div>
    <h5 class="text-center">${App.lang.modal_payment_failed_p2}</h5>
  `);
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
    return $.ajax({
      method: 'POST',
      url: `${App.settings.tablesync.url}/order`,
      data: order,
      timeout: 5000,
    }).done(() => {
      // console.log('Your order was successfully placed');
    }).fail(() => {
      App.showWarning(`
        ${App.locale === 'en' ? `<h4 class="text-center">Your order <strong>#${order.mask}</strong> was not successfully placed, please contact staff.</p>` : ''}
        ${App.locale === 'cs' ? `<h4 class="text-center">Vaše objednávka <strong>#${order.mask}</strong> nebyla úspěšně založena, prosím kontaktujte obsluhu.</p>` : ''}
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