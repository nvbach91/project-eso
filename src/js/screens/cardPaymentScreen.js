App.ptSend = function (ptRequest) {
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
          <h5 class="card-header">Information</h5>
          <div class="card-body">
            <p>Please follow instructions on the payment terminal screen</p>
          </div>
        </div>
      </div>
    </main>
  `);
  const inlineSpinner = App.createInlineSpinner();
  screen.find('.card-body').append(inlineSpinner);
  screen.hide();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn();

  const { totalPrice } = App.calculateCartSummaryValues();
  App.ptPay(totalPrice.formatMoney(), App.settings.currency.code, App.locale, 0).done((resp) => {
    //console.log(resp);
    const appendix = '';
    App.renderFinishScreen();
    App.createReceipt().done((resp) => {
      App.receipts.push(resp.msg);
      App.printReceipt(resp.msg, appendix);
    }).fail((resp) => {
      App.showWarning(`<p>There was a problem in processing your request (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p><p>Please contact staff</p>`);
    });
  }).fail((resp) => {
    App.showWarning(`<p>There was a problem in processing your request (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p><p>Please contact staff</p>`);
    App.renderCheckoutScreen();
  });
};

App.payInCash = () => {
  App.createReceipt().done((resp) => {
    App.receipts.push(resp.msg);
    App.printReceipt(resp.msg);
  }).fail((resp) => {
    App.showWarning(`<p>There was a problem in processing your request (${resp.responseJSON ? resp.responseJSON.msg : resp.status})</p><p>Please contact staff</p>`);
  }).always(() => {
    App.hideSpinner();
  });
};
