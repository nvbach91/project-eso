const createTable = () => $(`
  <table class="table">
    <thead>
      <tr class="transaction-item">
        <th class="ti-number">Receipt number</th>
        <th class="ti-date">Date</th>
        <th class="ti-order">${App.lang.form_order}</th>
        <th class="ti-payment">Payment</th>
        <th class="ti-delivery">Delivery</th>
        <th class="ti-total">Total price</th>
        <th class="ti-print">Print</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
`);

const renderTable = (transactions) => {
  if (!transactions.length) { 
    const content = $(`<button class="btn">${App.lang.tip_no_data_in_selected_period}</div>`);
    return App.jControlPanelBody.empty().append(content);
  }
  const newTable = createTable();
  transactions.forEach((transaction) => {
    const { number, date, order, payment, delivery, items } = transaction;
    const item = $(`
      <tr class="transaction-item">
        <td class="ti-number">${number}</td>
        <td class="ti-date">${moment(date).format(App.formats.dateTime)}</td>
        <td class="ti-order">#${App.settings.receipt.orderPrefix || ''}${order}</td>
        <td class="ti-payment">${App.getPaymentMethod(payment)}</td>
        <td class="ti-delivery">${App.getDeliveryMethod(delivery)}</td>
        <td class="ti-total">${App.calculateTransactionTotal(items).formatMoney()} ${App.settings.currency.symbol}</td>
        <td class="ti-print">
          <button class="btn btn-primary">${App.getIcon('print')}</button>
        </td>
      </tr>
    `);
    item.children('.ti-number').click(() => {
      const printer = App.settings.kioskPrinters[Object.keys(App.settings.kioskPrinters)[0]];
      App.displayKioskReceipt(transaction, '', printer, () => {});
    });
    item.children('.ti-print').find('button').click(() => {
      App.printKioskReceipt(transaction);
    });
    newTable.children('tbody').append(item);
  });
  const dataTable = newTable.DataTable({
    paging: false,
    searching: false,
    order: [[0, 'desc']],
    columnDefs: [
      {
        orderable: false,
        targets: [6],
      },
    ],
  });
  App.jControlPanelBody.empty().append($(dataTable.table().container()));
};

const clearTable = () => {
  const table = createTable();
  table.append(`<div>Something went wrong</div>`);
  App.jControlPanelBody.replaceWith(table);
  App.jControlPanelBody = table;
};

const onDateSelect = (date) => {
  App.fetchTransactionsByDatePrefix(date).done(renderTable).fail(clearTable);
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
  const cpBody = $(`<div class="card-body">`);
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
  App.fetchTransactionsByDatePrefix().done(renderTable).fail(clearTable);
};
