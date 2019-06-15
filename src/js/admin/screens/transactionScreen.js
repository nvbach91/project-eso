App.renderTransactionScreen  = () => {
  App.fetchTransactions().done((resp) => {
    const screen = $(`
      <div class="card no-bounds-card">
        <div class="table"></div>
      </div>
    `);
    const list = screen.children('.table');
    resp.forEach((transaction) => {
      const { number, date, order, payment, delivery, items } = transaction;
      const item = $(`
        <div class="transaction-item tr">
          <div class="td ti-number">${number}</div>
          <div class="td ti-date">${moment(date).format(App.formats.dateTime)}</div>
          <div class="td ti-order">${order}</div>
          <div class="td ti-payment">${App.getPaymentMethod(payment)}</div>
          <div class="td ti-delivery">${delivery}</div>
          <div class="td ti-total">${App.calculateTransactionTotal(items).formatMoney()} ${App.settings.currency.symbol}</div>
        </div>
      `);
      list.append(item);
    });
    App.jControlPanelBody.replaceWith(screen);
    App.jControlPanelBody = screen;
  });
};