App.renderTransactionScreen  = () => {
  App.fetchTransactions().done((resp) => {
    const screen = $(`
      <div class="card no-bounds-card">
        <div class="table">
          <div class="tr transaction-item">
            <div class="td ti-number">Receipt number</div>
            <div class="td ti-date">Date</div>
            <div class="td ti-order">Order</div>
            <div class="td ti-payment">Payment</div>
            <div class="td ti-delivery">Delivery</div>
            <div class="td ti-total">Total price</div>
            <div class="td ti-print">Print</div>
          </div>
        </div>
      </div>
    `);
    const list = screen.children('.table');
    resp.forEach((transaction) => {
      const { number, date, order, payment, delivery, items } = transaction;
      const item = $(`
        <div class="tr transaction-item">
          <div class="td ti-number">${number}</div>
          <div class="td ti-date">${moment(date).format(App.formats.dateTime)}</div>
          <div class="td ti-order">${order}</div>
          <div class="td ti-payment">${App.getPaymentMethod(payment)}</div>
          <div class="td ti-delivery">${App.getDeliveryMethod(delivery)}</div>
          <div class="td ti-total">${App.calculateTransactionTotal(items).formatMoney()} ${App.settings.currency.symbol}</div>
          <button class="td btn btn-primary ti-print"><i class="material-icons">print</i></button>
        </div>
      `);
      list.append(item);
    });
    App.jControlPanelBody.replaceWith(screen);
    App.jControlPanelBody = screen;
  });
};