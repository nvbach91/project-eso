
const img = 'https://amp.businessinsider.com/images/53a9d02becad04fd3af8649a-640-480.jpg';
//<h1 class="display-2">${App.settings.name}<h1>
App.renderHeader = () => {
  const { nItems, totalPrice } = App.calculateCartSummaryValues();
  const itemText = nItems == 1 ? App.lang.misc_item : nItems > 4 ? App.lang.misc_itemss : nItems == 0 ? App.lang.misc_itemss : App.lang.misc_items;
  const header = $(`
    <header id="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#">
          <img src="https://www.shareicon.net/download/2016/09/23/833952_food.svg" width="30" height="30" class="d-inline-block align-top" alt="">
          <span>The Elusive Camel</span>
        </a>
        <ul id="cart-control" class="navbar-nav">
          <li class="nav-item active" id="payment-method">
            <a class="nav-link" href="#">
              <span id="dining-choice"></span>&nbsp;
              <i class="material-icons">monetization_on</i>
            </a>
          </li>
          <li class="nav-item active" id="cart-indicator">
            <a class="nav-link" href="#">
              <span id="total">${totalPrice.formatMoney()}</span> 
              ${App.settings.currency.symbol}
            </a>
            <span id="items-count" class="badge badge-pill badge-light">${nItems} ${itemText}</span>
          </li>
        </ul>
      </nav>
    </header>
  `);
  App.jTotal = header.find('#total');
  App.jItemsCount = header.find('#items-count');
  App.jPaymentMethod = header.find('#payment-method');
  App.jCartControl = header.find('#cart-control');
  App.jDiningChoiceIndicator = header.find('#dining-choice');
  header.find('#cart-indicator').click(() => {
    App.showCart();
  });
  App.jHeader.replaceWith(header);
  App.jHeader = header;
};
