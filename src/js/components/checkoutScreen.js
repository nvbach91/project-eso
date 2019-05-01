const carousel = `
<div id="carousel" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carousel" data-slide-to="0" class="active"></li>
    <li data-target="#carousel" data-slide-to="1"></li>
    <li data-target="#carousel" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img class="d-block w-100" src="https://picsum.photos/id/1/600/150" alt="First slide">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="https://picsum.photos/id/2/600/150" alt="Second slide">
    </div>
    <div class="carousel-item">
      <img class="d-block w-100" src="https://picsum.photos/id/3/600/150" alt="Third slide">
    </div>
  </div>
</div>
`;
const controls = `
<a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
  <span class="sr-only">Previous</span>
</a>
<a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
  <span class="carousel-control-next-icon" aria-hidden="true"></span>
  <span class="sr-only">Next</span>
</a>
`;
App.renderCheckoutScreen = () => {
  const { totalPrice } = App.calculateCartSummaryValues();
  const screen = $(`
    <main id="main">
      <div class="payment-methods">
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

    } else {

    }
    App.renderFinishScreen();
  });
  screen.find('.go-back').click(function () {
    App.renderOrderScreen();
    App.showCart();
  });
  screen.hide();
  App.jBackButton.fadeOut();
  App.jCheckoutButton.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn();
};
