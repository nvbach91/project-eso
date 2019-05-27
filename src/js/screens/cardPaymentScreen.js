App.ptSend = (ptRequest) => {
  return $.post({
    url: App.settings.paymentTerminal.endpoint,
    dataType: 'json',
    data: ptRequest,
  });
};

App.ptPay = (amount, currency, customerLanguage, receiptNumber) => {
  var ptRequest = {
    transactionType: 'sale',
    ip: App.settings.paymentTerminal.ip,
    port: App.settings.paymentTerminal.port,
    amount: amount,
    currency: currency,
    customerLanguage: customerLanguage,
    referenceNumber: receiptNumber.toString(),
    password: App.settings.paymentTerminal.password
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
  App.ptPay(totalPrice.formatMoney(), App.settings.currency.code, App.locale, 0).done((resp) => {
    //console.log(resp);
    const appendix = '';
    App.renderFinishScreen();
    App.createReceipt().done((resp) => {
      App.receipts.push(resp.msg);
      App.printReceipt(resp.msg, appendix);
    }).fail((resp) => {
      App.showWarning(`<p>${App.lang.modal_payment_failed_p1} (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p><p>${App.lang.modal_payment_failed_p2}</p>`);
    });
  }).fail((resp) => {
    App.showWarning(`<p>${App.lang.modal_payment_failed_p1} (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p><p>${App.lang.modal_payment_failed_p2}</p>`);
    App.renderCheckoutScreen();
  });
};

App.payInCash = () => {
  App.createReceipt().done((resp) => {
    App.receipts.push(resp.msg);
    App.printReceipt(resp.msg);
  }).fail((resp) => {
    App.showWarning(`<p>${App.lang.modal_payment_failed_p1} (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p><p>${App.lang.modal_payment_failed_p2}</p>`);
  }).always(() => {
    App.hideSpinner();
  });
};
