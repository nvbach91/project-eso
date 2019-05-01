
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
App.renderPaymentChoiceScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="payment-methods">
        <div id="carousel" class="carousel slide" data-ride="carousel" style="margin-bottom: 10px; width: 100%; max-width: 900px;">
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
        <div class="selection">
          <div class="card" data-method="card">
            <div class="btn card-img-top" style="background-image: url(https://www.csob.cz/portal/documents/10710/29976/promobox-debetni-karta-standard)"></div>
            <div class="card-body">
              <h5 class="card-title">Pay by card</h5>
              <p class="card-text">Simply use your credit card to pay</p>
              <button class="btn btn-primary btn-raised">I'll do it myself</button>
            </div>
          </div>
          <div class="card" data-method="cash">
            <div class="btn card-img-top" style="background-image: url(https://s8523.pcdn.co/wp-content/uploads/sites/4/2014/06/cash-payments.jpg)"></div>
            <div class="card-body">
              <h5 class="card-title">Pay in cash</h5>
              <p class="card-text">Even up in person at checkout</p>
              <button class="btn btn-primary btn-danger btn-raised">I'd like some human interactions</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `);
  screen.find('.selection .card').click(function () {
    App.paymentMethod = $(this).data('method');
    App.jPaymentMethod.find('i').text(App.paymentMethod === 'card' ? 'payment' : 'monetization_on');
    App.renderDiningChoiceScreen();
  });
  //setTimeout(() => {
    App.jMain.replaceWith(screen);
    App.jMain = screen;
  //  App.jMain.fadeIn();
  //}, 500);
};
