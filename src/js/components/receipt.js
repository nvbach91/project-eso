
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

App.printReceipt = (receipt) => {
  const receiptText = App.renderReceiptText(receipt);
  App.printDirect(receiptText);
};

App.renderReceiptText = (receipt) => {
  const receiptWidthSettings = App.receiptWidths[App.settings.receipt.width];
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
    `\n\tTIN: ${App.settings.tin}\t` +
    `\n\tVAT: ${App.settings.vat}\t` +
    `\nResidence: ${App.settings.residence.street}` +
    `\n${App.settings.residence.zip} ${App.settings.residence.city}` +
    `\nPremise: ${App.settings.residence.street}` +
    `\n${App.settings.residence.zip} ${App.settings.residence.city}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `${App.settings.receipt.header ? `\n\t${App.settings.receipt.header}\t\n` : ''}`;

  let body =
    `\t${receiptHasTax ? 'VAT Invoice' : 'Invoice'} #${App.ESCPOS.bold(receipt.number)}\t` +
    `\n${receipt.items.map((item) => {
      const itemTotal = item.quantity * item.price;
      subTotal += itemTotal;
      const tax = App.calculateTaxFromPrice(itemTotal, item.tax);
      taxSummary[item.tax].tax += tax;
      taxSummary[item.tax].total += itemTotal;
      const quantityPadded = App.addPadding(item.quantity, 7);
      return `${item.name}\n${quantityPadded} x${App.addPadding(item.price, 10 + receiptWidthSettings.extraPadding)}\t${itemTotal.formatMoney()} ${App.taxMarks[item.tax]}`;
    }).join('\n')}` +
    `\n${App.getReceiptHorizontalLine()}`;

  const total = App.round(subTotal, 2);
  const change = receipt.tendered - total;
  let payment =
    `${App.ESCPOS.bigFont(`Total:\t${total.formatMoney()} ${App.settings.currency.code}`)}` +
    `\nTendered:\t${receipt.tendered.formatMoney()}` +
    `${change ? `\nChange:\t${change.formatMoney()}` : ''}`;

  let summary =
    `Rates${App.addPadding(`Net`, 14 + receiptWidthSettings.extraPadding)}\tVAT` +
    `\n${Object.keys(taxSummary).filter((taxRate) => {
      return taxSummary[taxRate].total !== 0;
    }).map((taxRate) => {
      const thisNet = taxSummary[taxRate].total - taxSummary[taxRate].tax;
      return `${App.taxMarks[taxRate]} ${App.addPadding(taxRate, 2)}%${App.addPadding(thisNet.formatMoney(), 14 + receiptWidthSettings.extraPadding)}\t${taxSummary[taxRate].tax.formatMoney()}`;
    }).join('\n')}` +
    `${receipt.bkp ?
      `\n${App.getReceiptHorizontalLine()}` +
      `\nPRE: ${App.settings.ors.store_id}, POS: ${App.settings.number}` +
      `\nBKP: ${receipt.bkp}` +
      `\nFIK: ${receipt.fik}` : ''
    }`;

  let footer =
    `Clerk: ${App.getClerk(receipt.clerk)}` +
    `\n${moment(receipt.date).format(App.formats.dayDateTime)}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `\n${App.settings.receipt.footer ? `${App.settings.receipt.footer}` : ''}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `\n\t${App.receiptCredits}\t`;

  let text = `${header}\n${body}\n${payment}\n${summary}\n${footer}`;
  return App.alignReceiptText(text);
};

App.alignReceiptText = (text) => {
  const maxWidth = App.receiptWidths[App.settings.receipt.width].printWidth;
  return text.split('\n').map((line) => {
    const tabs = line.match(/\t|\\t/g);
    if (tabs) {
      let lineLength = line.length;
      if (line.includes('\x1b\x451') && line.includes('\x1b\x450')) {
        lineLength -= 6;
      }
      if (line.includes('\x1b\x21\x10') && line.includes('\x1b\x21\x00')) {
        lineLength -= 6;
      }
      const spaceCount = Math.floor((maxWidth - lineLength) / tabs.length) + 1;
      if (spaceCount > 0) {
        line = line.replace(/\t|\\t/g, ' '.repeat(spaceCount));
      } else {
        line = line.replace(/\t|\\t/g, '');
      }
    }
    if (maxWidth - line.length === 1) {
      line = line.replace('   ', '    ');
    }
    return line;
  }).join('\n');
};


App.getReceiptHorizontalLine = () => {
  return '-'.repeat(App.receiptWidths[App.settings.receipt.width].printWidth);
};
