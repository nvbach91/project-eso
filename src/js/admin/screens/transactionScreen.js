const createTransactiontable = () => $(`
  <div class="table card-body transactions">
    <div class="tr transaction-item">
      <div class="td ti-number">Receipt number</div>
      <div class="td ti-date">Date</div>
      <div class="td ti-order">${App.lang.form_order}</div>
      <div class="td ti-payment">Payment</div>
      <div class="td ti-delivery">Delivery</div>
      <div class="td ti-total">Total price</div>
      <div class="td ti-print">Print</div>
    </div>
  </div>
`);

const renderTransactions = (transactions) => {
  let table;
  if (transactions.length) {
    table = createTransactiontable();
    transactions.forEach((transaction) => {
      const { number, date, order, payment, delivery, items } = transaction;
      const item = $(`
        <div class="tr transaction-item">
          <div class="td ti-number">${number}</div>
          <div class="td ti-date">${moment(date).format(App.formats.dateTime)}</div>
          <div class="td ti-order">#${App.settings.receipt.orderPrefix}${order}</div>
          <div class="td ti-payment">${App.getPaymentMethod(payment)}</div>
          <div class="td ti-delivery">${App.getDeliveryMethod(delivery)}</div>
          <div class="td ti-total">${App.calculateTransactionTotal(items).formatMoney()} ${App.settings.currency.symbol}</div>
          <div class="td ti-print">
            <button class="btn btn-primary">${App.getIcon('print')}</button>
          </div>
        </div>
      `);
      item.children('.ti-number').click(() => {
        App.showInModal(`<pre class="receipt-preview">${App.renderReceiptText(transaction).replace(/[`´^ˇ<>{}\[\]]|\x1d\x421|\x1d\x420/g, '')}</pre>`);
      });
      item.children('.ti-print').find('button').click(() => {
        App.printKioskReceipt(transaction);
      });
      table.append(item);
    });
  } else {
    table = $(`<button class="btn">${App.lang.tip_no_data_in_selected_period}</div>`);
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

const onDateSelect = (date) => {
  App.fetchTransactionsByDatePrefix(date).done(renderTransactions).fail(clearTransactions);
};

App.renderTransactionScreen = () => {
  App.destroyDatePickers();
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_transactions}</div>
      <div class="cp-control">
        <button class="btn btn-primary date-nav" id="date-prev">${App.getIcon('keyboard_arrow_left')}</button>
        <button class="btn btn-primary datepicker-btn" data-id="datepicker">${App.getIcon('date_range')}</button>
        <input type="text" class="form-control datetimepicker-input" id="datepicker">
        <button class="btn btn-primary date-nav" id="date-next">${App.getIcon('keyboard_arrow_right')}</button>
      </div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const datePicker = App.bindDatePicker({ id: 'datepicker', onSelect: onDateSelect });
  header.find('.date-nav').click(function () {
    const currentDate = datePicker.getDate();
    if ($(this).attr('id') === 'date-next') {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate <= new Date()) {
        datePicker.setDate(currentDate);
      }
    } else {
      currentDate.setDate(currentDate.getDate() - 1);
      datePicker.setDate(currentDate);
    }
  });
  App.fetchTransactionsByDatePrefix().done(renderTransactions).fail(clearTransactions);
};
