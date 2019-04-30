
const img = 'https://amp.businessinsider.com/images/53a9d02becad04fd3af8649a-640-480.jpg';
//<h1 class="display-2">${App.settings.name}<h1>
App.renderHeader = () => {
  const { nItems, totalPrice } = App.calculateCartSummaryValues();
  const header = $(`
    <header id="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#">
          <img src="https://www.shareicon.net/download/2016/09/23/833952_food.svg" width="30" height="30" class="d-inline-block align-top" alt="">
          The Elusive Camel
        </a>
        <ul class="navbar-nav">
          <li class="nav-item active" id="payment-method">
            <a class="nav-link" href="#"><i class="material-icons">${App.paymentMethod === 'card' ? 'payment' : 'monetization_on'}</i></a>
          </li>
          <li class="nav-item active" id="cart-indicator">
            <a class="nav-link" href="#"><span id="total">${totalPrice.formatMoney()}</span> ${App.settings.currency.symbol}</a>
            <span id="items-count" class="badge badge-pill badge-light">${nItems} items</span>
          </li>
        </ul>
      </nav>
    </header>
  `);
  App.jTotal = header.find('#total');
  App.jItemsCount = header.find('#items-count');
  App.jPaymentMethod = header.find('#payment-method');
  App.jPaymentMethod.click(() => {
    App.renderPaymentChoiceScreen();
  });
  header.find('#cart-indicator').click(() => {
    App.showCart();
  });
  App.jHeader.replaceWith(header);
  App.jHeader = header;
};
