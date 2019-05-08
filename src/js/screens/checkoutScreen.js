App.renderCheckoutScreen = () => {
  const { totalPrice } = App.calculateCartSummaryValues();
  const screen = $(`
    <main id="main">
      <div class="screen payment-methods">
        <div class="card full-width-card">
          <h5 class="card-header">How would you like to pay?</h5>
        </div>
        <br>
        <div class="selection">
          <div class="card payment-method" data-method="card">
            <div class="btn card-img-top" style="background-image: url(https://www.csob.cz/portal/documents/10710/29976/promobox-debetni-karta-standard)"></div>
            <div class="card-body">
              <h5 class="card-title">Pay by card <strong>${totalPrice.formatMoney()} ${App.settings.currency.symbol}</strong></h5>
              <p class="card-text">Simply use your credit card to pay</p>
              <button class="btn btn-primary btn-raised">I'll pay by card</button>
            </div>
          </div>
          <div class="card payment-method" data-method="cash">
            <div class="btn card-img-top" style="background-image: url(https://s8523.pcdn.co/wp-content/uploads/sites/4/2014/06/cash-payments.jpg)"></div>
            <div class="card-body">
              <h5 class="card-title">Pay in cash <strong>${App.round(totalPrice, 2).formatMoney()} ${App.settings.currency.symbol}</strong></h5>
              <p class="card-text">Even up in person at checkout</p>
              <button class="btn btn-primary btn-danger btn-raised">I'd like to pay in cash</button>
            </div>
          </div>
        </div>
        <br>
        <div class="card full-width-card">
          <h5 class="card-header">Forgot something?</h5>
          <div class="card-body">
            <button class="btn btn-warning go-back btn-icon">
              <i class="material-icons">arrow_back</i>
              <span>Go back</span>
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
  screen.find('.go-back').click(function () {
    App.renderOrderScreen();
    App.showCart();
  });
  //screen.hide();
  screen.find('.card').hide();
  App.jBackButton.fadeOut();
  App.jCheckoutButton.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  //App.jMain.fadeIn();
  screen.find('.card').slideDown();
};
