const createTransactiontable = () => $(`
  <div class="table card-body">
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
`);
const renderTransactions = (transactions) => {
  const table = createTransactiontable();
  if (transactions.length) {
    transactions.forEach((transaction) => {
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
      item.children('.ti-number').click(() => {
        App.showInModal(`<pre class="receipt-preview">${App.renderReceiptText(transaction).replace(/[`´^ˇ<>{}\[\]]|\x1d\x421|\x1d\x420/g, '')}</pre>`);
      });
      item.children('.ti-print').click(() => {
        App.printReceipt(transaction);
      });
      table.append(item);
    });
  } else {
    table.append(`<div>There is no data for this time range</div>`);
  }
  App.jControlPanelBody.replaceWith(table);
  App.jControlPanelBody = table;
};
const clearTransactions = () => {
  const table = createTransactiontable();
  table.append(`<div>Something went wrong</div>`);
  App.jControlPanelBody.replaceWith(table);
  App.jControlPanelBody = table;
};
App.renderTransactionScreen = () => {
  App.destroyPikadays();
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Transactions</div>
      <div class="cp-control">
        <button class="btn btn-primary date-nav" id="date-prev"><i class="material-icons">keyboard_arrow_left</i></button>
        <button class="btn btn-primary datepicker-btn"><i class="material-icons">date_range</i></button>
        <input type="text" class="form-control datetimepicker-input" id="datepicker">
        <button class="btn btn-primary date-nav" id="date-next"><i class="material-icons">keyboard_arrow_right</i></button>
      </div>
    </div>
  `);
  const dateField = header.find('#datepicker');
  const pikaday = new Pikaday({
    setDefaultDate: true,
    defaultDate: new Date(),
    maxDate: new Date(),
    field: dateField.get(0),
    format: App.formats.date,
    onSelect: (date) => {
      App.fetchTransactionsByDatePrefix(date).done(renderTransactions).fail(clearTransactions);
    }
  });
  header.find('.datepicker-btn').click(() => dateField.click());
  header.find('.date-nav').click(function () {
    const currentDate = pikaday.getDate();
    if ($(this).attr('id') === 'date-next') {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate <= new Date()) {
        pikaday.setDate(currentDate);
      }
    } else {
      currentDate.setDate(currentDate.getDate() - 1);
      pikaday.setDate(currentDate);
    }
  });
  App.pikadayInstances.push(pikaday);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  App.fetchTransactionsByDatePrefix().done(renderTransactions).fail(clearTransactions);
};
