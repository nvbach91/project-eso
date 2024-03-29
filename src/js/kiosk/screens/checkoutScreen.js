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
          ${Object.keys(App.settings.paymentMethods).filter((key) => App.settings.paymentMethods[key].enabled).map((key) => {
            const pm = App.settings.paymentMethods[key];
            return (`
              <div class="card payment-method" data-method="${key}">
                <div class="btn card-img-top" style="background-image: url(${App.imageUrlBase}${pm.img})"></div>
                <div class="card-body">
                  <h5 class="card-title">${App.lang[`checkout_${key}_pay_title`]} <strong>${totalPrice.formatMoney()} ${App.settings.currency.symbol}</strong></h5>
                  <p class="card-text">${App.lang[`checkout_${key}_pay_desc`]}</p>
                  <button class="btn btn-primary btn-raised">${App.lang[`checkout_${key}_pay_btn`]}</button>
                </div>
              </div>
            `)
          }).join('')}
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
    if (Offline.state === 'down') {
      return App.showWarning(`<h4 class="text-center">${App.lang.misc_device_is_offline}</h4>`);
    }
    App.paymentMethod = $(this).data('method');
    if (App.paymentMethod === 'card') {
      App.renderCardPaymentScreen();
    } else {
      App.payInCash();
    }
  });
  screen.find('.go-back').click(() => {
    if (App.deliveryMethod === 'eatin' && App.settings.tableMarkers.active) {
      App.renderTableMarkerScreen();
    } else {
      App.renderOrderScreen();
      App.showCart();
    }
  });
  screen.find('.card').hide();
  App.jBackButton.fadeOut();
  App.jCheckoutButton.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  screen.find('.card').slideDown(App.getAnimationTime());
};
