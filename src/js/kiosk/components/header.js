App.renderHeader = () => {
  const header = $(`
    <header id="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#">
          <img src="https://www.shareicon.net/download/2016/09/23/833952_food.svg" width="30" height="30" class="d-inline-block align-top" alt="">
          <span>The Elusive Camel</span>
        </a>
        <ul id="delivery-method" class="navbar-nav">
          <li class="nav-item active" id="payment-method">
            <a class="nav-link" href="#">
              <span></span>&nbsp;
              ${App.getIcon('book')}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `);
  App.jPaymentMethod = header.find('#payment-method');
  App.jDeliveryMethodIndicator = header.find('#delivery-method');
  App.jHeader.replaceWith(header);
  App.jHeader = header;
};
