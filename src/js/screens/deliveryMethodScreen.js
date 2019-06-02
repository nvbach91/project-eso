App.renderDeliveryMethodScreen = () => {
  App.jOrderPreview.remove();
  App.jDeliveryMethodIndicator.fadeOut();
  App.jCheckoutButton.fadeOut();
  App.deliveryMethods = {
    'eatin': { 
      title: App.lang.delivery_method_eat_in_title,
      text: App.lang.delivery_method_eat_in_text,
      btn: { text: App.lang.delivery_method_eat_in_btn, class: 'btn-primary' },
      img: 'https://media1.s-nbcnews.com/j/streams/2014/October/141006/2D274906938828-today-cafeteria-140811-01.fit-760w.jpg',
    },
    'takeout': { 
      title: App.lang.delivery_method_take_out_title,
      text: App.lang.delivery_method_take_out_text,
      btn: { text: App.lang.delivery_method_take_out_btn, class: 'btn-warning' },
      img: 'https://www.sld.com/wp-content/uploads/2017/03/1280x480RestaurantTakeOut.jpg',
    },
  };
  const screen = $(`
    <main id="main">
      <div class="screen delivery-methods">
        <div class="card full-width-card">
          <h5 class="card-header">${App.lang.delivery_method_welcome_title}</h5>
          <div class="card-body">
            <h5 class="card-title">Daily offer: special on-the-house treatment</h5>
            <p class="card-text">Order 5 get 1 free</p>
            <button class="btn btn-primary">${App.lang.delivery_method_special_offer_btn}</button>
          </div>
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
    App.deliveryMethod = $(this).data('method');
    App.jDeliveryMethodIndicator.find('span').text(App.deliveryMethods[App.deliveryMethod].title);
    App.renderOrderScreen();
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
