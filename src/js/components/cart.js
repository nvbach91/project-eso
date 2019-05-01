
App.addToCart = (id) => {
  if (App.cart[id]) {
    App.cart[id].quantity++;
  } else {
    App.cart[id] = {
      quantity: 1
    };
  }
  App.jProducts.find(`[data-id="${id}"]`).fadeIn().find('span').text(App.cart[id].quantity);
  App.jModal.find(`.product-details [data-id="${id}"]`).fadeIn().find('span').text(App.cart[id].quantity);
  App.jModal.find(`.cart [data-id="${id}"]`).text(App.cart[id].quantity);
  App.calculateCart();
  App.saveLocalCart();
};

App.decrementFromCart = (id) => {
  if (App.cart[id]) {
    App.cart[id].quantity--;
    App.jProducts.find(`[data-id="${id}"]`).find('span').text(App.cart[id].quantity);
    App.jModal.find(`.cart [data-id="${id}"]`).text(App.cart[id].quantity);
    if (App.cart[id].quantity <= 0) {
      delete App.cart[id];
      App.jProducts.find(`[data-id="${id}"]`).fadeOut();
    }
    App.saveLocalCart();
  }
};

App.removeFromCart = (id) => {
  delete App.cart[id];
  App.jProducts.find(`[data-id="${id}"]`).fadeOut();
  App.saveLocalCart();
};

App.removeAllFromCart = () => {
  App.cart = {};
  App.jProducts.find('.cart-quantity-indicator').fadeOut();
  App.saveLocalCart();
};

App.calculateCartSummaryValues = () => {
  let nItems = 0;
  let totalPrice = 0;
  Object.keys(App.cart).forEach((id) => {
    const product = App.products[id];
    const cartItem = App.cart[id];
    let itemPrice = cartItem.quantity * product.price;
    itemPrice = itemPrice - itemPrice * (product.discount || 0) / 100;
    totalPrice += itemPrice;
    nItems += cartItem.quantity;
  });
  return { nItems, totalPrice };
};

App.calculateCart = () => {
  const { nItems, totalPrice } = App.calculateCartSummaryValues();
  App.jModal.find('.cs-quantity').text(`${nItems} items`);
  App.jModal.find('.cs-price').find('span').text(`${totalPrice.formatMoney()} ${App.settings.currency.symbol}`);
  App.jItemsCount.text(`${nItems} items`);
  App.jTotal.text(totalPrice.formatMoney());
};

App.showCart = () => {
  const element = $(`<div class="cart"></div>`);
  const cartItems = $(`<div class="cart-items"></div>`);
  Object.keys(App.cart).forEach((id) => {
    const product = App.products[id];
    const cartItem = App.cart[id];
    const thisTotal = cartItem.quantity * product.price;
    const style = ` style="background-image: url(${App.config.imageUrlBase}${product.img})"`;
    const el = $(`
      <div class="cart-item">
        <div class="ci-img"${style}></div>
        <div class="ci-name">${product.name}</div>
        <button class="btn btn-primary btn-dec">-</button>
        <div class="ci-quantity" data-id="${id}">${cartItem.quantity}</div>
        <button class="btn btn-primary btn-inc">+</button>
        <div class="ci-price">${product.price}</div>
        <div class="ci-total">${thisTotal.formatMoney()}</div>
        <button class="btn btn-primary ci-remove">&times;</button>
      </div>
    `);
    el.find('.ci-remove').click(() => {
      App.removeFromCart(id);
      App.calculateCart();
      el.find('button').prop('disabled', true);
      el.slideUp(() => {
        el.remove();
        if (!Object.keys(App.cart).length) {
          App.jModal.modal('toggle');
        }
      });
    });
    el.find('.btn-dec').click(() => {
      App.decrementFromCart(id);
      if (!App.cart[id]) {
        el.find('button').prop('disabled', true);
        el.fadeOut(() => {
          el.remove();
          if (!Object.keys(App.cart).length) {
            App.jModal.modal('toggle');
          }
        });
      }
      App.calculateCart();
    });
    el.find('.btn-inc').click(() => {
      App.addToCart(id);
      App.calculateCart();
    });
    cartItems.append(el);
  });
  const { nItems, totalPrice } = App.calculateCartSummaryValues();
  const cartSummary = $(`
    <div class="cart-summary">
      <div class="btn btn-primary cs-quantity">${nItems} items</div>
      <div>
        <button class="btn btn-danger cs-cancel">Cancel Order</button>
        <button class="btn btn-primary btn-raised btn-lg cs-price">Order <span>${totalPrice.formatMoney()} ${App.settings.currency.symbol}</span></button>
      </div>
    </div>
  `);
  cartSummary.find('.cs-cancel').click(() => {
    App.removeAllFromCart();
    cartItems.empty();
    App.calculateCart();
    App.jModal.modal('toggle');
  });
  element.append(cartItems);
  element.append(cartSummary);
  App.showInModal(element, 'Your order');
};
