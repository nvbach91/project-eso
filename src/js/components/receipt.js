
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
  return '';
};
