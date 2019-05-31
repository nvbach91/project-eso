
App.findReceiptByNumber = (number) => {
  return App.receipts.find((receipt) => receipt.number === number);
};

App.createReceipt = () => {
  App.showSpinner();
  return $.post({
    url: '/sale',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(App.cart),
  });
};

App.printReceipt = (receipt, appendix) => {
  const receiptText = App.renderReceiptText(receipt) + (appendix ? `\n${appendix}` : '');
  App.printDirect(receiptText);
};

App.renderReceiptText = (receipt) => {
  let receiptHasTax = false;
  const taxSummary = {};
  for (let i = 0; i < App.settings.taxRates.length; i++) {
    taxSummary[App.settings.taxRates[i]] = { tax: 0, total: 0 };
  }
  for (let i = 0; i < receipt.items.length; i++) {
    let item = receipt.items[i];
    if (item.tax > 0) {
      receiptHasTax = true;
      break;
    }
  }
  let subTotal = 0;

  let header =
    `\t${App.ESCPOS.bigFont(App.settings.name)}\t` +
    `\n\t${App.lang.receipt_header_tin}: ${App.settings.tin}\t` +
    `\n\t${App.lang.receipt_header_vat}: ${App.settings.vat}\t` +
    `\n${App.lang.receipt_header_residence}: ${App.settings.address.street}` +
    `\n${App.settings.address.zip} ${App.settings.address.city}` +
    `\n${App.lang.receipt_header_premise}: ${App.settings.residence.street}` +
    `\n${App.settings.residence.zip} ${App.settings.residence.city}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `${App.settings.receipt.header ? `\n\t${App.settings.receipt.header}\t\n` : ''}`;

  let body =
    `\t${receiptHasTax ? App.lang.receipt_body_vat_invoice : App.lang.receipt_body_invoice} #${App.ESCPOS.bold(receipt.number)}\t` +
    `\n${receipt.items.map((item) => {
      const itemTotal = item.quantity * item.price;
      subTotal += itemTotal;
      const tax = App.calculateTaxFromPrice(itemTotal, item.tax);
      taxSummary[item.tax].tax += tax;
      taxSummary[item.tax].total += itemTotal;
      const quantityPadded = App.addPadding(item.quantity, 7);
      return `${item.name}\n${quantityPadded} x${App.addPadding(item.price, 10 + App.settings.receipt.extraPadding)}\t${itemTotal.formatMoney()} ${App.taxMarks[item.tax]}`;
    }).join('\n')}` +
    `\n${App.getReceiptHorizontalLine()}`;

  const total = App.round(subTotal, 2);
  const change = receipt.tendered - total;
  let payment =
    `${App.ESCPOS.bigFont(`${App.lang.receipt_payment_total}:\t${total.formatMoney()} ${App.settings.currency.code}`)}` +
    `\n${App.lang.receipt_payment_method}:\t${App.getPaymentMethod(receipt.payment)}` +
    `\n${App.lang.receipt_payment_tendered}:\t${receipt.tendered.formatMoney()}` +
    `${change ? `\n${App.lang.receipt_payment_change}:\t${change.formatMoney()}` : ''}`;

  let summary =
    `${App.lang.receipt_summary_rates}${App.addPadding(App.lang.receipt_summary_net, 14 + App.settings.receipt.extraPadding)}\t${App.lang.receipt_summary_vat}` +
    `\n${Object.keys(taxSummary).filter((taxRate) => {
      return taxSummary[taxRate].total !== 0;
    }).map((taxRate) => {
      const thisNet = taxSummary[taxRate].total - taxSummary[taxRate].tax;
      return `${App.taxMarks[taxRate]} ${App.addPadding(taxRate, 2)}%${App.addPadding(thisNet.formatMoney(), 14 + App.settings.receipt.extraPadding)}\t${taxSummary[taxRate].tax.formatMoney()}`;
    }).join('\n')}` +
    `${receipt.bkp ?
      `\n${App.getReceiptHorizontalLine()}` +
      `\n${App.lang.receipt_summary_pre}: ${App.settings.ors.store_id}, ${App.lang.receipt_summary_pos}: ${App.settings.number}` +
      `\n${App.lang.receipt_summary_bkp}: ${receipt.bkp}` +
      `\n${App.lang.receipt_summary_fik}: ${receipt.fik}` : ''
    }`;

  let footer =
    `${App.lang.receipt_footer_clerk}: ${App.getClerk(receipt.clerk)}` +
    `\n${moment(receipt.date).format(App.formats.dayDateTime)}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `\n${App.settings.receipt.footer ? `${App.settings.receipt.footer}` : ''}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `\n\t${App.receiptCredits}\t`;

  let text = `${header}\n${body}\n${payment}\n${summary}\n${footer}`;
  const result = App.alignReceiptText(text);
  return result;
};

App.alignReceiptText = (text) => {
  return text.split('\n').map((line) => {
    const tabs = line.match(/\t|\\t/g);
    if (tabs) {
      let lineLength = line.length;
      if (line.includes('[') && line.includes(']')) {
        lineLength -= 2;
      }
      if (line.includes('{') && line.includes('}')) {
        lineLength -= 2;
      }
      if (line.includes('`') && line.includes('´')) {
        lineLength -= 2;
      }
      const spaceCount = Math.floor((App.settings.receipt.printWidth - lineLength) / tabs.length) + 1;
      if (spaceCount > 0) {
        line = line.replace(/\t|\\t/g, ' '.repeat(spaceCount));
      } else {
        line = line.replace(/\t|\\t/g, '');
      }
    }
    if (App.settings.receipt.printWidth - line.length === 1) {
      line = line.replace('   ', '    ');
    }
    return line;
  }).join('\n');
};


App.getReceiptHorizontalLine = () => {
  return '-'.repeat(App.settings.receipt.printWidth);
};
