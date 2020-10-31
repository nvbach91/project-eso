App.createNewTransactionNumber = (lastTransaction) => {
  const thisYearPrefix = new Date().getFullYear().toString().slice(2);
  const registerNumber = App.settings.number < 10 ? '0' + App.settings.number : App.settings.number;
  const lastTransactionNumber =
    lastTransaction ?
      lastTransaction.number :
      (parseInt(thisYearPrefix + registerNumber + '0000000') - 1);
  let newTransactionNumber = parseInt(lastTransactionNumber) + 1;
  // creating new year prefix based on the current time prefix and last receipt prefix
  if (thisYearPrefix !== lastTransactionNumber.toString().slice(0, 2)) {
    newTransactionNumber = parseInt(thisYearPrefix + registerNumber + '0000000');
  }
  return newTransactionNumber;
};

App.createTransaction = () => {
  return App.fetchTransactions(0, 1).then((transactions) => {
    if (transactions.length) {
      return transactions[0];
    }
    return App.getLastTransaction();
  }).then((lastTransaction) => {
    const newTransactionNumber = App.createNewTransactionNumber(lastTransaction);
    const cartKeys = Object.keys(App.cart);
    if (cartKeys.includes('T')) {
      cartKeys.push(cartKeys.splice(cartKeys.indexOf('T'), 1)[0]);
    }
    const transaction = {
      number: newTransactionNumber,
      order: App.maskOrderNumber(newTransactionNumber),
      date: new Date().toISOString(),
      items: cartKeys.map((id) => {
        const { ean } = App.cart[id];
        const { group, price, vat } = App.products[ean];
        const { quantity, discount, mods } = App.cart[id];
        const item = { quantity, ean, price, group, vat };
        if (discount) {
          item.discount = discount;
        }
        if (mods) {
          item.mods = mods;
        }
        return item;
      }),
      delivery: App.deliveryMethod,
      payment: App.paymentMethod,
      discount: 0,
      clerk: App.user.username.split(':')[1],
    };
    return $.post({
      url: App.apiPrefix + '/transactions',
      beforeSend: App.attachToken,
      contentType: 'application/json',
      data: JSON.stringify(transaction),
    });
  });
};

App.printReceipt = (transaction, appendix) => {
  const receiptText = App.renderReceiptText(transaction);
  if (App.settings.printer.direct) {
    const text = receiptText + (appendix ? `\n${appendix}` : '');
    App.printDirect(App.settings.printer.diacritics ? App.removeVietnameseDiacritics(text) : App.removeDiacritics(text), App.settings.printer.name);
  } else {
    App.showInModal(`<pre class="receipt-preview">${receiptText.replace(/[`´^ˇ<>{}\[\]]|\x1d\x421|\x1d\x420/g, '')}</pre>`, '', window.print);
    App.jModal.find('.cs-cancel').remove();
  }
};

App.printKitchenReceipt = (transaction) => {
  const receiptText = App.renderKitchenReceiptText(transaction);
  if (App.settings.kitchenPrinter.direct) {
    const text = App.renderKitchenReceiptText(transaction);
    App.printDirect(App.settings.kitchenPrinter.diacritics ? App.removeVietnameseDiacritics(text) : App.removeDiacritics(text), App.settings.kitchenPrinter.name);
  } else {
    App.showInModal(`<pre class="receipt-preview">${receiptText.replace(/[`´^ˇ<>{}\[\]]|\x1d\x421|\x1d\x420/g, '')}</pre>`, '', window.print);
    App.jModal.find('.cs-cancel').remove();
  }
};

App.renderReceiptText = (transaction) => {
  let transactionHasTax = false;
  const vatSummary = {};
  for (let i = 0; i < App.settings.vatRates.length; i++) {
    vatSummary[App.settings.vatRates[i]] = { vat: 0, total: 0 };
  }
  for (let i = 0; i < transaction.items.length; i++) {
    let item = transaction.items[i];
    if (item.vat > 0) {
      transactionHasTax = true;
      break;
    }
  }
  let subTotal = 0;

  const header =
    `\t${App.ESCPOS.doubleHeight(App.settings.name)}\t` +
    `\n${App.lang.receipt_header_premise}: ${App.settings.residence.street}` +
    `\n${App.settings.residence.zip} ${App.settings.residence.city}` +
    `\n\t${App.settings.companyName}\t` +
    `\n\t${App.lang.receipt_header_tin}: ${App.settings.tin} | ${App.lang.receipt_header_vat}: ${App.settings.vat}\t` +
    `\n${App.lang.receipt_header_residence}: ${App.settings.address.street}` +
    `\n${App.settings.address.zip} ${App.settings.address.city}` +
    //`\n${App.getReceiptHorizontalLine()}` +
    `${App.settings.receipt.header ? `\n\t${App.settings.receipt.header}\t` : ''}`;

  const body =
    `${App.ESCPOS.quadrupleSize(`${App.lang.receipt_header_order} K#${transaction.order}`)}` +
    `\n${App.ESCPOS.quadrupleSize(App.getDeliveryMethod(transaction.delivery))}` +
    `${transaction.payment === 'cash' ? `\n${App.ESCPOS.quadrupleSize(App.lang.receipt_not_paid)}` : ''}` +
    `\n${`${transactionHasTax ? App.lang.receipt_body_vat_invoice : App.lang.receipt_body_invoice} #${App.ESCPOS.bold(transaction.number)}`}` +
    `\n${transaction.items.filter((item) => {
        if (!App.settings.printer.groups) {
          return true;
        }
        return App.settings.printer.groups.split(',').includes(item.group.toString());
      }).map((item) => {
      let itemPrice = parseFloat(item.price);
      if (item.mods) {
        item.mods.forEach((mod) => {
          itemPrice += parseFloat(mod.price);
        });
      }
      const itemTotal = item.quantity * itemPrice;
      subTotal += itemTotal;
      const vat = App.calculateTaxFromPrice(itemTotal, item.vat);
      vatSummary[item.vat].vat += vat;
      vatSummary[item.vat].total += itemTotal;
      const quantityPadded = App.addPadding(item.quantity, 7);
      const product = App.products[item.ean];
      const itemName = product ? product.name : ('EAN: ' + item.ean);
      let mods = '';
      if (item.mods) {
        mods = item.mods.map((mod) => `  - ${App.mods[mod.number] ? App.mods[mod.number].name : `${mod.number} - N/A`}${parseFloat(mod.price) ? ` +${mod.price}` : ''}`).join('\n');
      }
      return `${App.ESCPOS.bold(itemName)}${mods ? `\n${mods}` : ''}\n${quantityPadded} x${App.addPadding(itemPrice.formatMoney(), 10 + App.settings.receipt.extraPadding)}\t${itemTotal.formatMoney()} ${App.vatMarks[item.vat]}`;
    }).join('\n')}`;// +
    //`\n${App.getReceiptHorizontalLine()}`;

  const total = App.round(subTotal, 2);
  //const change = transaction.tendered - total;
  const payment =
    `${App.ESCPOS.doubleHeight(`${App.lang.receipt_payment_total}:\t${total.formatMoney()} ${App.settings.currency.code}`)}` +
    `\n${App.lang.receipt_payment_method}:\t${App.getPaymentMethod(transaction.payment)}`/* +
     `\n${App.lang.receipt_payment_tendered}:\t${transaction.tendered.formatMoney()}` +
     `${change ? `\n${App.lang.receipt_payment_change}:\t${change.formatMoney()}` : ''}`*/;

  const receiptLargeEnough = App.settings.printer.columns >= 38;
  const extraPadding = App.settings.receipt.extraPadding;
  const summary =
    App.lang.receipt_summary_rates +
    App.addPadding(App.lang.receipt_summary_net, 8 + extraPadding) +
    (receiptLargeEnough ? App.addPadding(App.lang.receipt_summary_vat, 8 + extraPadding) : `\t${App.lang.receipt_summary_vat}`) +
    (receiptLargeEnough ? `\t${App.lang.receipt_payment_total}` : '') +

    `\n${Object.keys(vatSummary).filter((vatRate) => {
      return vatSummary[vatRate].total !== 0;
    }).map((vatRate) => {
      const thisNet = vatSummary[vatRate].total - vatSummary[vatRate].vat;
      const thisVat = vatSummary[vatRate].vat.formatMoney();
      return (
        App.vatMarks[vatRate] + ' ' +
        App.addPadding(vatRate, 2) + '%' +
        App.addPadding(thisNet.formatMoney(), 8 + extraPadding) +
        (receiptLargeEnough ? App.addPadding(thisVat, 8 + extraPadding) : ('\t' + thisVat)) +
        (receiptLargeEnough ? ('\t' + vatSummary[vatRate].total.formatMoney()) : '')
      );
    }).join('\n')}` +
    `${transaction.bkp ?
      //`\n${App.getReceiptHorizontalLine()}` +
      `\n${App.lang.receipt_summary_pre}: ${App.settings.ors.store_id}, ${App.lang.receipt_summary_pos}: ${App.settings.number}` +
      `\n${App.lang.receipt_summary_bkp}:${transaction.bkp}` +
      `\n${App.lang.receipt_summary_fik}:${transaction.fik}` : ''
    }`;

  const footer =
    `${App.lang.receipt_footer_clerk}: ${App.getClerk(transaction.clerk)}` +
    `\n${moment(transaction.date).format(App.formats.dayDateTime)}` +
    //`\n${App.getReceiptHorizontalLine()}` +
    `\n${App.settings.receipt.footer ? `${App.settings.receipt.footer}` : ''}` +
    //`\n${App.getReceiptHorizontalLine()}` +
    `\n\t${App.credits}\t`;

  const text = `${header}\n${body}\n${payment ? payment + '\n' : ''}${summary}\n${footer}\n\n\n\n.`;
  //const text = `${body}`;
  const result = App.alignReceiptText(text);
  return result;
};

App.renderKitchenReceiptText = (transaction) => {
  const text =
    `${App.ESCPOS.quadrupleSize(`${App.lang.receipt_header_order} K#${transaction.order}`)}` +
    `\n${App.ESCPOS.quadrupleSize(App.getDeliveryMethod(transaction.delivery))}` +
    `${transaction.payment === 'cash' ? `\n${App.ESCPOS.quadrupleSize(App.lang.receipt_not_paid)}` : ''}` +
    `\n${moment(transaction.date).format(App.formats.dateTime)}` +
    `\n${transaction.items.filter((item) => {
        if (!App.settings.kitchenPrinter.groups) {
          return true;
        }
        return App.settings.kitchenPrinter.groups.split(',').includes(item.group.toString());
      }).map((item) => {
      // const quantityPadded = App.addPadding(item.quantity, 7);
      const product = App.products[item.ean];
      const itemName = product ? `${item.ean}: ${product.name}` : `EAN: ${item.ean}`;
      let mods = '';
      if (item.mods) {
        mods = item.mods.map((mod) => `  - ${App.mods[mod.number] ? App.mods[mod.number].name : `${mod.number} - N/A`}`).join('\n');
      }
      return `${App.ESCPOS.quadrupleSize(`${item.quantity} x ${itemName}`)}${mods ? `\n${mods}` : ''}`;
    }).join('\n')}` +
    //`\n${App.ESCPOS.quadrupleSize(`${App.lang.receipt_header_order} #${transaction.order}`)}`
    `\n\n\n\n.`;

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
      if (line.includes('\x1d\x421') && line.includes('\x1d\x420')) {
        lineLength -= 6;
      }
      if (line.includes('^') && line.includes('ˇ')) {
        lineLength -= 2;
        lineLength += lineLength;
      }
      const remainingSpaceCount = Math.floor((App.settings.printer.columns - lineLength) / tabs.length) + 1;
      if (remainingSpaceCount > 0) {
        line = line.replace(/\t|\\t/g, ' '.repeat(remainingSpaceCount));
      } else {
        line = line.replace(/\t|\\t/g, '');
      }
    }
    if (App.settings.printer.columns - line.length === 1) {
      line = line.replace('   ', '    ');
    }
    return line;
  }).join('\n');
};


App.getReceiptHorizontalLine = () => {
  return '-'.repeat(App.settings.printer.columns);
};

App.createRandomNumberArray = (n) => {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(i)
  }
  let counter = array.length, temp, index;
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
};

App.randomOrderNumbers = App.createRandomNumberArray(100);

App.maskOrderNumber = (number) => {
  return App.randomOrderNumbers[parseInt(number.toString().slice(-2))];
};
