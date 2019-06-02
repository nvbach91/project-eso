App.getLastTransaction = () => {
  return App.transactions[App.transactions.length - 1];
};

App.createNewTransactionNumber = (lastTransaction) => {
  const thisYearPrefix = new Date().getFullYear().toString().slice(2);
  const lastTransactionNumber =
    lastTransaction ?
      lastTransaction.number : (parseInt(thisYearPrefix + App.settings.number + "0000000") - 1);
  let newTransactionNumber = parseInt(lastTransactionNumber) + 1;
  // creating new year prefix based on the current time prefix and last receipt prefix
  if (thisYearPrefix !== lastTransactionNumber.toString().slice(0, 2)) {
    newTransactionNumber = parseInt(thisYearPrefix + App.settings.number + "0000000");
  }
  return newTransactionNumber;
};

App.createTransaction = () => {
  return App.fetchLastTransaction().then((lastTransaction) => {
    const newTransactionNumber = App.createNewTransactionNumber(lastTransaction);
    const transaction = {
      number: newTransactionNumber,
      order: App.maskOrderNumber(newTransactionNumber),
      date: new Date().toISOString(),
      items: Object.keys(App.cart).map((ean) => {
        const { group, price, vat } = App.products[ean];
        const { quantity, discount } = App.cart[ean];
        const item = { quantity, ean, price, group, vat };
        if (discount) {
          item.discount = discount;
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
  const text = App.renderReceiptText(transaction) + (appendix ? `\n${appendix}` : '');
  App.printDirect(text);
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
    `\n\tTIN: ${App.settings.tin}\t` +
    `\n\tVAT: ${App.settings.vat}\t` +
    `\nResidence: ${App.settings.address.street}` +
    `\n${App.settings.address.zip} ${App.settings.address.city}` +
    `\nPremise: ${App.settings.residence.street}` +
    `\n${App.settings.residence.zip} ${App.settings.residence.city}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `${App.settings.receipt.header ? `\n\t${App.settings.receipt.header}\t` : ''}`;

  const body = 
    `\t${App.ESCPOS.quadrupleSize(`Order #${transaction.order}`)}\t` +
    `\n${App.ESCPOS.invert(`\t${transactionHasTax ? 'VATx Invoice' : 'Invoice'} #${App.ESCPOS.bold(transaction.number)}\t`)}` +
    `\n${transaction.items.map((item) => {
      const itemTotal = item.quantity * item.price;
      subTotal += itemTotal;
      const vat = App.calculateTaxFromPrice(itemTotal, item.vat);
      vatSummary[item.vat].vat += vat;
      vatSummary[item.vat].total += itemTotal;
      const quantityPadded = App.addPadding(item.quantity, 7);
      const product = App.products[item.ean];
      const itemName = product ? product.name : ('EAN: ' + item.ean);
      return `${App.ESCPOS.bold(itemName)}\n${quantityPadded} x${App.addPadding(item.price, 10 + App.settings.receipt.extraPadding)}\t${itemTotal.formatMoney()} ${App.vatMarks[item.vat]}`;
    }).join('\n')}` +
    `\n${App.getReceiptHorizontalLine()}`;

  const total = App.round(subTotal, 2);
  // const change = transaction.tendered - total;
  const payment = '';
  //   `${App.ESCPOS.doubleHeight(`Total:\t${total.formatMoney()} ${App.settings.currency.code}`)}` +
  //   `\nPayment method:\t${App.getPaymentMethod(transaction.payment)}` +
  //   `\nTendered:\t${transaction.tendered.formatMoney()}` +
  //   `${change ? `\nChange:\t${change.formatMoney()}` : ''}`;

  const summary =
    'Rates' + 
    App.addPadding('Net', 10 + App.settings.receipt.extraPadding) + 
    (App.settings.receipt.printWidth >= 38 ? App.addPadding('VAT', 10 + App.settings.receipt.extraPadding) : '\tVAT') +
    (App.settings.receipt.printWidth >= 38 ? '\tTotal' : '') +
    
    `\n${Object.keys(vatSummary).filter((vatRate) => {
      return vatSummary[vatRate].total !== 0;
    }).map((vatRate) => {
      const thisNet = vatSummary[vatRate].total - vatSummary[vatRate].vat;
      return (
        App.vatMarks[vatRate] + ' ' +
        App.addPadding(vatRate, 2) + '%' +
        App.addPadding(thisNet.formatMoney(), 10 + App.settings.receipt.extraPadding) +
        (App.settings.receipt.printWidth >= 38 ? App.addPadding(vatSummary[vatRate].vat.formatMoney(), 10 + App.settings.receipt.extraPadding) : ('\t' + vatSummary[vatRate].vat.formatMoney())) +
        (App.settings.receipt.printWidth >= 38 ? ('\t' + (thisNet + vatSummary[vatRate].vat).formatMoney()) : '')
      );
    }).join('\n')}` +
    `${transaction.bkp ?
      `\n${App.getReceiptHorizontalLine()}` +
      `\nPRE: ${App.settings.ors.store_id}, POS: ${App.settings.number}` +
      `\nBKP: ${transaction.bkp}` +
      `\nFIK: ${transaction.fik}` : ''
    }`;

  const footer =
    `Clerk: ${App.getClerk(transaction.clerk)}` +
    `\n${moment(transaction.date).format(App.formats.dayDateTime)}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `\n${App.settings.receipt.footer ? `${App.settings.receipt.footer}` : ''}` +
    `\n${App.getReceiptHorizontalLine()}` +
    `\n\t${App.credits}\t`;

  const text = `${header}\n${body}\n${payment ? payment + '\n' : ''}${summary}\n${footer}`;
  //const text = `${body}`;
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
      const remainingSpaceCount = Math.floor((App.settings.receipt.printWidth - lineLength) / tabs.length) + 1;
      if (remainingSpaceCount > 0) {
        line = line.replace(/\t|\\t/g, ' '.repeat(remainingSpaceCount));
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
  return App.randomOrderNumbers[number.toString().slice(-2)];
};
