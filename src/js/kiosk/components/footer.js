
App.renderFooter = () => {
  const footer = $(`
    <footer id="footer">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item" id="back-button">
            <a class="nav-link active" href="#">${App.getIcon('arrow_back')}<span>${App.lang.misc_go_back}</span></a>
          </li>
          <li class="nav-item" id="company-credits">
            <a class="nav-link" href="#">${new Date().getFullYear()} &copy; Ethereals United</a>
          </li>
          <li id="locale-switcher"></li>
          <li class="nav-item">
            <button id="checkout-button" class="btn btn-primary btn-icon btn-raised">
              <span>${App.lang.order_checkout_btn}</span>
              ${App.getIcon('arrow_forward')}
            </button>
          </li>
        </ul>
      </div>
    </footer>
  `);
  App.jFooter.replaceWith(footer);
  App.jFooter = footer;
  App.jBackButton = footer.find('#back-button');
  App.jCheckoutButton = footer.find('#checkout-button');
  App.jCheckoutButton.click(() => {
    if (Object.keys(App.cart).length) {
      App.showCart();
    }
  });
  
  App.jLocaleSwitcher = App.createLocaleSwitcher({});
  App.jFooter.find('#locale-switcher').replaceWith(App.jLocaleSwitcher);
};
