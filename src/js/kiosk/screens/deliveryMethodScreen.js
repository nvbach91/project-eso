App.renderDeliveryMethodScreen = () => {
  App.jOrderPreview.remove();
  App.jDeliveryMethodIndicator.fadeOut();
  App.jCheckoutButton.fadeOut();
  App.deliveryMethods = {
    'eatin': { 
      title: App.lang.delivery_method_eatin,
      text: App.lang.delivery_method_eatin_text,
      btn: { text: App.lang.delivery_method_eatin_btn, class: 'btn-primary' },
      img: `${App.imageUrlBase}eatin_zd3gg0`,
    },
    'takeout': { 
      title: App.lang.delivery_method_takeout,
      text: App.lang.delivery_method_takeout_text,
      btn: { text: App.lang.delivery_method_takeout_btn, class: 'btn-warning' },
      img: `${App.imageUrlBase}takeout_v1ldmt`,
    },
  };
  const screen = $(`
    <main id="main">
      <div class="screen delivery-methods">
        <div class="card full-width-card">
          <h5 class="card-header">${App.lang.delivery_method_welcome_title}</h5>
          <!--div class="card-body">
            <h5 class="card-title">Daily offer: special on-the-house treatment</h5>
            <p class="card-text">Order 5 get 1 free</p>
            <button class="btn btn-primary">${App.lang.delivery_method_special_offer_btn}</button>
          </div-->
        </div>
        <br>
        <div class="selection">
          ${Object.keys(App.deliveryMethods).map((key) => {
            const dc = App.deliveryMethods[key];
            return `
              <div class="card" data-method="${key}">
                <div class="btn card-img-top" style="background-image: url(${dc.img})"></div>
                <div class="card-body">
                  <h5 class="card-title">${dc.title}</h5>
                  <p class="card-text">${dc.text}</p>
                  <button class="btn ${dc.btn.class} btn-raised">${dc.btn.text}</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </main>
  `);
  screen.find('.selection .card').click(function () {
    const newDeliveryMethod = $(this).data('method');
    const deliveryMethodChanged = App.deliveryMethod && App.deliveryMethod !== newDeliveryMethod;
    App.deliveryMethod = $(this).data('method');
    App.jDeliveryMethodIndicator.find('span').text(App.deliveryMethods[App.deliveryMethod].title);
    // if (App.deliveryMethod === 'eatin' && App.cart['T']) {
    //   for (let i = 0; i < App.cart['T'].quantity; i++) {
    //     App.decrementFromCart('T');
    //   }
    // }
    App.renderOrderScreen();
    if (deliveryMethodChanged) {
      App.removeAllFromCart();
    }
  });
  App.jBackButton.fadeIn().off('click').click(() => {
    App.reset();
  });
  screen.hide();
  screen.find('.card').hide();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn(() => {
    screen.find('.card').slideDown(App.getAnimationTime());
  });
  App.jLocaleSwitcher.fadeOut();
  App.startActivitySession();
};
