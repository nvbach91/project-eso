App.createNewTransactionNumber = (lastTransaction) => {
  const thisYearPrefix = new Date().getFullYear().toString().slice(2);
  const registerNumber = App.settings.number < 10 ? `0${App.settings.number}` : App.settings.number;
  const lastTransactionNumber =
    lastTransaction ?
      lastTransaction.number :
      (parseInt(`${thisYearPrefix}${registerNumber}0000000`) - 1);
  let newTransactionNumber = parseInt(lastTransactionNumber) + 1;
  // creating new year prefix based on the current time prefix and last receipt prefix
  if (thisYearPrefix !== lastTransactionNumber.toString().slice(0, 2)) {
    newTransactionNumber = parseInt(`${thisYearPrefix}${registerNumber}0000000`);
  }
  return newTransactionNumber;
};

App.createTransaction = (transactionNumber, isCreatingOfflineOrder) => {
  const cartKeys = Object.keys(App.cart);
  if (cartKeys.includes('T')) {
    cartKeys.push(cartKeys.splice(cartKeys.indexOf('T'), 1)[0]);
  }
  const transaction = {
    number: transactionNumber,
    order: App.maskOrderNumber(transactionNumber),
    date: new Date().toISOString(),
    items: cartKeys.map((id) => {
      const { ean } = App.cart[id];
      const { group, price, vat } = App.products[ean];
      const { quantity, discount, mods } = App.cart[id];
      const item = { quantity, ean, price, group, vat, mods };
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
  if (isCreatingOfflineOrder) {
    App.offlineTransactions.push(transaction);
    localStorage.setItem('offlineTransactions', JSON.stringify(App.offlineTransactions));
    return $.when(transaction);
  };
  return $.post({
    url: `${App.apiPrefix}/transactions`,
    beforeSend: App.attachToken,
    contentType: 'application/json',
    data: JSON.stringify(transaction),
  });
};

App.removeReceiptFormatting = (text) => {
  return text.replace(/[`´^ˇ<>{}\[\]]|\x1d\x421|\x1d\x420/g, '');
};

App.printKioskReceipt = (transaction, appendix) => {
  Object.keys(App.settings.kioskPrinters).forEach((id) => {
    const printer = App.settings.kioskPrinters[id];
    if (printer.direct) {
      const alignedReceiptText = App.renderKioskReceipt(transaction, printer, true);
      let text = alignedReceiptText + (appendix ? `\n${appendix}` : '');
      if (printer.style === 'plain') {
        text = App.removeReceiptFormatting(text);
      }
      App.printDirect(Object.assign({},
        printer,
        {
          content: printer.diacritics ? App.removeVietnameseDiacritics(text) : App.removeDiacritics(text),
          printer: printer.name,
        }
      ));
    } else {
      App.displayKioskReceipt(transaction, appendix, printer, window.print);
    }
  });
};

App.displayKioskReceipt = (transaction, appendix, printer, printFunction) => {
  const unAlignedReceiptText = App.renderKioskReceipt(transaction, printer, false) + (appendix ? `\n${appendix}` : '');
  const determineLargeFontLine = (line) => {
    const keys = ['receipt_payment_total', 'receipt_header_order', 'receipt_not_paid', 'delivery_method_eatin', 'delivery_method_takeout'];
    for (const key of keys) {
      if (line.trim().startsWith(App.lang[key])) {
        return true;
      }
    }
    return false;
  };
  let previousLineIsFixed = false;
  App.showInModal(`
    <div class="receipt-preview card">
      ${App.settings.receipt.img ? `<div class="receipt-image" style="background-image: url(${App.imageUrlBase}${App.settings.receipt.img});"></div>` : ''}
      ${App.removeReceiptFormatting(unAlignedReceiptText).split('\n').map((line) => {
        const isFixedWithLine = line.trim().startsWith(App.lang.receipt_summary_rates);
        if (isFixedWithLine || previousLineIsFixed) {
          line = line.replace('\t', ' ');
        }
        const lineContent = line.replace(/^!/, '').replace(/\\t/g, '\t').split('\t').map((part) => {
          if (isFixedWithLine || previousLineIsFixed) {
            return part.split(/\s+/).map((p, i) => `<span class="receipt-vat-column">${p}</span>`).join('');
          }
          return `<span>${part}</span>`;
        }).join('');
        previousLineIsFixed = isFixedWithLine; 
        const isLargeFontLine = determineLargeFontLine(line);
        const isBoldFontLine = line.startsWith('!'); // the exclamation mark is present when priting via browser render (not direct print)
        return `<div class="rp-line${isLargeFontLine ? ' rp-large' : ''}${isBoldFontLine ? ' rp-bold' : ''}">${lineContent}</div>`;
      }).join('')}
    </div>
  `, '', printFunction);
  App.jModal.find('.cs-cancel').remove();
};

App.printKitchenReceipt = (transaction) => {
  Object.keys(App.settings.kitchenPrinters).forEach((id) => {
    const printer = App.settings.kitchenPrinters[id];
    const receiptText = App.renderKitchenReceiptText(transaction, printer);
    if (printer.direct) {
      let text = App.renderKitchenReceiptText(transaction, printer);
      if (printer.style === 'plain') {
        text = App.removeReceiptFormatting(text);
      }
      App.printDirect(Object.assign({},
        printer,
        {
          content: printer.diacritics ? App.removeVietnameseDiacritics(text) : App.removeDiacritics(text),
          printer: printer.name,
        }
      ));
    } else {
      App.showInModal(`<pre class="receipt-preview">${App.removeReceiptFormatting(receiptText)}</pre>`, '', window.print);
      App.jModal.find('.cs-cancel').remove();
    }
  });
};

App.printLabelReceipt = (transaction) => {
  Object.keys(App.settings.labelPrinters).forEach((id) => {
    const printer = App.settings.labelPrinters[id];
    const printGroups = printer.groups;
    const toPrintItems = transaction.items.filter((item) => {
      if (!printGroups) {
        return true;
      }
      return printGroups.split(',').includes(item.group.toString());
    });
    toPrintItems.forEach((item, index) => {
      if (printer.direct) {
        const text = App.renderLabelReceiptText(transaction, item, index, toPrintItems.length, printer);
        App.printDirect(Object.assign({},
          printer,
          {
            content: printer.diacritics ? App.removeVietnameseDiacritics(text) : App.removeDiacritics(text),
            printer: printer.name,
            pageWidth: printer.pageWidth || '500',
            pageHeight: printer.pageHeight || '300',
          }
        ));
      } else {
        App.showInModal(`<pre class="receipt-preview">${App.removeReceiptFormatting(receiptText)}</pre>`, '', window.print);
        App.jModal.find('.cs-cancel').remove();
      }
    });
  });
};

App.renderKioskReceipt = (transaction, printer, useAlign) => {
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

  
  const orderNumber = `${App.lang.receipt_header_order} #${App.settings.receipt.orderPrefix}${transaction.order}`;
  const orderNumberLine = App.settings.receipt.highlightOrderNumber ? App.ESCPOS.invert(` ${orderNumber} `) : orderNumber;
  const deliveryMethodRow = App.ESCPOS.quadrupleSize(`\t${App.getDeliveryMethod(transaction.delivery)}${App.tableMarkerValue ? ` /${App.tableMarkerValue}/` : ''}\t`, printer.style);
  const header =
    (App.settings.receipt.deliveryMethodPosition === 'top' ? `${deliveryMethodRow}\n` : '') +
    `\t${App.ESCPOS.bold(App.settings.name)}\t` +
    `\n\t${App.lang.receipt_header_premise}: ${App.settings.address.street.replace(/\\n/g, '\n').replace(/\\t/g, '\t')} ${App.settings.address.zip} ${App.settings.address.city}` +
    `\n\t${App.settings.companyName}\t` +
    `\n\t${App.lang.receipt_header_tin}: ${App.settings.tin} ${App.lang.receipt_header_vat}: ${App.settings.vat}\t` +
    `\n\t${App.settings.residence.street.replace(/\\n/g, '\n').replace(/\\t/g, '\t')} ${App.settings.residence.zip} ${App.settings.residence.city}\t` +
    //`\n${App.getReceiptHorizontalLine(printer)}` +
    `${App.settings.receipt.header ? `\n\t${App.settings.receipt.header}\t` : ''}`;

  const body =
    App.ESCPOS.quadrupleSize(`\t${orderNumberLine}\t`, printer.style) +
    (App.settings.receipt.deliveryMethodPosition === 'middle' ? `\n${deliveryMethodRow}` : '') +
    `${transaction.payment === 'cash' ? `\n${App.ESCPOS.quadrupleSize(`\t${App.lang.receipt_not_paid}\t`, printer.style)}` : ''}` +
    `\n${`\t${transactionHasTax ? App.lang.receipt_body_vat_invoice : App.lang.receipt_body_invoice} #${App.ESCPOS.bold(transaction.number)}\t`}` +
    `\n${transaction.items.filter((item) => {
        if (!printer.groups) {
          return true;
        }
        return printer.groups.split(',').includes(item.group.toString());
      }).map((item) => {
      let itemPrice = parseFloat(item.price);
      item.mods.forEach((mod) => {
        itemPrice += (mod.quantity || 1) * mod.price;
      });
      const itemTotal = item.quantity * itemPrice;
      subTotal += itemTotal;
      const vat = App.calculateTaxFromPrice(itemTotal, item.vat);
      vatSummary[item.vat].vat += vat;
      vatSummary[item.vat].total += itemTotal;
      const quantityPadded = App.addPadding(item.quantity, 7);
      const product = App.products[item.ean];
      const itemName = `${product ? product.name : `${App.lang.form_ean}: ${item.ean}`} ${item.mods.length ? `(${item.price} ${App.settings.currency.code})` : ''}`;
      let modText = item.mods.map((mod) => ` *${parseFloat(mod.price) ? ` ${mod.quantity}x +${mod.price} ${App.settings.currency.code}` : ''} ${App.mods[mod.number] ? App.mods[mod.number].name : `${mod.number} - N/A`}`).join('\n');
      return `${useAlign ? '' : '!'}${App.ESCPOS.bold(itemName)}${modText ? `\n${modText}` : ''}\n${quantityPadded} x${App.addPadding(itemPrice.formatMoney(), 10 + App.settings.receipt.extraPadding)}\t${itemTotal.formatMoney()} ${App.vatMarks[item.vat]}`;
    }).join('\n')}`;// +
    //`\n${App.getReceiptHorizontalLine(printer)}`;

  const total = App.round(subTotal, 2);
  //const change = transaction.tendered - total;
  const payment =
    `${App.ESCPOS.doubleHeight(`${App.lang.receipt_payment_total}:\t${total.formatMoney()} ${App.settings.currency.code}`)}` +
    `\n${App.lang.receipt_payment_method}:\t${App.getPaymentMethod(transaction.payment)}`/* +
     `\n${App.lang.receipt_payment_tendered}:\t${transaction.tendered.formatMoney()}` +
     `${change ? `\n${App.lang.receipt_payment_change}:\t${change.formatMoney()}` : ''}`*/;

  const receiptLargeEnough = printer.columns >= 38;
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
        `${App.vatMarks[vatRate]}` +
        // `${App.addPadding(vatRate, 2)}%` +
        `${vatRate}%` +
        App.addPadding(thisNet.formatMoney(), 8 + extraPadding) +
        (receiptLargeEnough ? App.addPadding(thisVat, 8 + extraPadding) : `\t${thisVat}`) +
        (receiptLargeEnough ? `\t${vatSummary[vatRate].total.formatMoney()}` : '')
      );
    }).join('\n')}` +
    `${transaction.bkp ?
      //`\n${App.getReceiptHorizontalLine(printer)}` +
      `\n${App.lang.receipt_summary_pre}: ${App.settings.ors.store_id}, ${App.lang.receipt_summary_pos}: ${App.settings.number}` +
      `\n${App.lang.receipt_summary_bkp}:${transaction.bkp}` +
      `\n${App.lang.receipt_summary_fik}:${transaction.fik}` : ''
    }`;

  const footer =
    `${App.lang.receipt_footer_clerk}: ${App.getClerk(transaction.clerk)}` +
    `\n${moment(transaction.date).format(App.formats.dateTime)}` +
    //`\n${App.getReceiptHorizontalLine(printer)}` +
    `\n${App.settings.receipt.footer ? `${App.settings.receipt.footer}` : ''}` +
    //`\n${App.getReceiptHorizontalLine(printer)}` +
    `\n\t${App.credits}\t` + 
    (App.settings.receipt.deliveryMethodPosition === 'bottom' ? `\n${deliveryMethodRow}` : '');

  const text = `${header}\n${body}\n${payment ? `${payment}\n` : ''}${summary}\n${footer}\n\n\n.`;
  //const text = `${body}`;
  const result = useAlign ? App.alignReceiptText(text, printer.columns) : text;
  return result;
};

App.renderKitchenReceiptText = (transaction, printer) => {
  const orderNumber = `${App.lang.receipt_header_order} #${App.settings.receipt.orderPrefix}${transaction.order}`;
  const orderNumberLine = App.settings.receipt.highlightOrderNumber ? App.ESCPOS.invert(` ${orderNumber} `) : orderNumber;
  const text =
    `${App.ESCPOS.quadrupleSize(`\t${orderNumberLine}\t`)}` +
    `\n${App.ESCPOS.quadrupleSize(`\t${App.getDeliveryMethod(transaction.delivery)}${App.tableMarkerValue ? ` /${App.tableMarkerValue}/` : ''}\t`)}` +
    `${transaction.payment === 'cash' ? `\n${App.ESCPOS.quadrupleSize(`\t${App.lang.receipt_not_paid}\t`)}` : ''}` +
    `\n${moment(transaction.date).format(App.formats.dateTime)}` +
    `\n${transaction.items.filter((item) => {
        if (!printer.groups) {
          return true;
        }
        return printer.groups.split(',').includes(item.group.toString());
      }).map((item) => {
      // const quantityPadded = App.addPadding(item.quantity, 7);
      const product = App.products[item.ean];
      const itemName = product ? `${product.name}` : `${App.lang.form_ean}: ${item.ean}`;
      let modText = item.mods.map((mod) => ` *${parseFloat(mod.price) ? ` ${mod.quantity}x` : ''} ${App.mods[mod.number] ? App.mods[mod.number].name : `${mod.number} - N/A`}`).join('\n');
      return `${App.ESCPOS.quadrupleSize(`${item.quantity}x ${itemName}`)}${modText ? `\n${modText}` : ''}`;
    }).join('\n')}` +
    `\n\n.`;

  const result = App.alignReceiptText(text, printer.columns);
  return result;
};

App.shortenTextByColumns = (text, columns) => {
  const regex = new RegExp(`.{1,${columns}}`,'g')
  return text.match(regex).join('\n');
};
App.renderLabelReceiptText = (transaction, item, index, totalItems, labelPrinter) => {
  const orderLine = `${App.lang.receipt_header_order} #${App.settings.receipt.orderPrefix}${transaction.order}`;
  const deliveryMethod = `${App.getDeliveryMethod(transaction.delivery)}${App.tableMarkerValue ? ` /${App.tableMarkerValue}/` : ''}`;
  const text =
    (
      labelPrinter.style === 'plain' ?
        `${orderLine}\t${deliveryMethod}` :
        `${App.ESCPOS.quadrupleSize(orderLine)}\n${App.ESCPOS.quadrupleSize(deliveryMethod)}`
    ) +
    `\n${moment(transaction.date).format('DD.MM HH:mm:ss')}\t${index + 1}/${totalItems}` +
    `\n${(() => {
      const product = App.products[item.ean];
      const itemName = product ? `${product.name}` : `${App.lang.form_ean}: ${item.ean}`;
      const modText = item.mods.map((mod) => ` *${parseFloat(mod.price) ? ` ${mod.quantity}x` : ''} ${App.mods[mod.number] ? App.mods[mod.number].name : `${mod.number} - N/A`}`).join('\n');
      const itemLine = App.shortenTextByColumns(`${item.quantity} x ${itemName}`, labelPrinter.columns);
      return App.ESCPOS.quadrupleSize(itemLine, labelPrinter.style) + (modText ? `\n${modText}` : '');
    })()}\n`;

  const result = App.alignReceiptText(text, labelPrinter.columns);
  return result;
};

App.alignReceiptText = (text, columns) => {
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
      const remainingSpaceCount = Math.floor((columns - lineLength) / tabs.length) + 1;
      if (remainingSpaceCount > 0) {
        line = line.replace(/\t|\\t/g, ' '.repeat(remainingSpaceCount / (line.includes('^') && line.includes('ˇ') ? 2 : 1)));
      } else {
        line = line.replace(/\t|\\t/g, '');
      }
    }
    if (columns - line.length === 1) {
      line = line.replace('   ', '    ');
    }
    return line;
  }).join('\n');
};


App.getReceiptHorizontalLine = (printer) => {
  return '-'.repeat(printer.columns);
};

App.randomOrderNumbersCount = 100;

App.createRandomNumberArray = () => {
  const date = moment().format(App.formats.datePrefix);
  const existingDate = localStorage.getItem('randomOrderNumbersDate');
  let array = [];
  if (date === existingDate) {
    try {
      array = JSON.parse(localStorage.getItem('randomOrderNumbers'));
    } catch (e) {}
  }
  if (array.length === App.randomOrderNumbersCount) {
    return array;
  }
  for (let i = 0; i < App.randomOrderNumbersCount; i++) {
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
  localStorage.setItem('randomOrderNumbers', JSON.stringify(array));
  localStorage.setItem('randomOrderNumbersDate', date);
  return array;
};

App.randomOrderNumbers = App.createRandomNumberArray();

App.maskOrderNumber = (receiptNumber) => {
  if (App.settings.receipt.masking) {
    const orderNumber = parseInt(receiptNumber.toString().slice(-(App.randomOrderNumbersCount - 1).toString().length));
    return (App.settings.receipt.orderInitial || 0) + App.randomOrderNumbers[orderNumber];
  }

  const lastOrderNumberDate = localStorage.getItem('lastOrderNumberDate');
  const datePrefix = moment().format(App.formats.datePrefix);
  let lastOrderNumber = -1;
  if (datePrefix === lastOrderNumberDate) {
    lastOrderNumber = parseInt(localStorage.getItem('lastOrderNumber') || '-1');
  }
  localStorage.setItem('lastOrderNumber', lastOrderNumber + 1);
  localStorage.setItem('lastOrderNumberDate', datePrefix);
  return (App.settings.receipt.orderInitial || 0) + lastOrderNumber + 1;
};
