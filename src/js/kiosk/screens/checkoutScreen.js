App.renderCheckoutScreen = () => {
  App.jOrderPreview.remove();
  const { totalPrice } = App.calculateCartSummaryValues();
  const screen = $(`
    <main id="main">
      <div class="screen payment-methods">
        <div class="card full-width-card">
          <h5 class="card-header">${App.lang.checkout_title}</h5>
        </div>
        <br>
        <div class="selection">
          <div class="card payment-method" data-method="card">
            <div class="btn card-img-top" style="background-image: url(https://www.csob.cz/portal/documents/10710/29976/promobox-debetni-karta-standard)"></div>
            <div class="card-body">
              <h5 class="card-title">${App.lang.checkout_card_pay_title} <strong>${totalPrice.formatMoney()} ${App.settings.currencySymbol}</strong></h5>
              <p class="card-text">${App.lang.checkout_card_pay_desc}</p>
              <button class="btn btn-primary btn-raised">${App.lang.checkout_card_pay_btn}</button>
            </div>
          </div>
          <div class="card payment-method" data-method="cash">
            <div class="btn card-img-top" style="background-image: url(https://securecdn.pymnts.com/wp-content/uploads/2017/10/Europe_Cash-Usage_Global-Cash-Index.jpg)"></div>
            <div class="card-body">
              <h5 class="card-title">${App.lang.checkout_cash_pay_title} <strong>${App.round(totalPrice, 2).formatMoney()} ${App.settings.currencySymbol}</strong></h5>
              <p class="card-text">${App.lang.checkout_cash_pay_desc}</p>
              <button class="btn btn-primary btn-danger btn-raised">${App.lang.checkout_cash_pay_btn}</button>
            </div>
          </div>
        </div>
        <br>
        <div class="card full-width-card">
          <h5 class="card-header">${App.lang.checkout_return_title}</h5>
          <div class="card-body">
            <button class="btn btn-warning go-back btn-icon">
              ${App.getIcon('arrow_back')}
              <span>${App.lang.checkout_return_btn}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  `);
  screen.find('.payment-method').click(function () {
    App.paymentMethod = $(this).data('method');
    if (App.paymentMethod === 'card') {
      App.renderCardPaymentScreen();
    } else {
      App.payInCash();
    }
  });
  screen.find('.go-back').click(() => {
    App.renderOrderScreen();
    App.showCart();
  });
  screen.find('.card').hide();
  App.jBackButton.fadeOut();
  App.jCheckoutButton.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  screen.find('.card').slideDown(App.getAnimationTime());
};
