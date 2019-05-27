
App.addToCart = (id) => {
  App.jOrderPreviewList.children().removeClass('last');
  if (App.cart[id]) {
    App.cart[id].quantity++;
  } else {
    App.cart[id] = {
      quantity: 1
    };
    const orderPreviewItem = App.createOrderPreviewItem(id);
    App.jOrderPreviewList.append(orderPreviewItem.addClass('last').hide().fadeIn());
    
    App.jOrderPreviewList.animate({
      scrollLeft: orderPreviewItem.offset().left
    }, App.getAnimationTime());
  }
  App.jOrderPreview.fadeIn();
  const existingOrderPreviewItem = App.jOrderPreviewList.find(`[data-id="${id}"]`).fadeIn().parent().parent().addClass('last');
  /*App.jOrderPreviewList.animate({
    scrollLeft: existingOrderPreviewItem.offset().left
  }, App.getAnimationTime());*/
  existingOrderPreviewItem.find('span').text(App.cart[id].quantity);
  App.jProducts.find(`[data-id="${id}"]`).fadeIn().find('span').text(App.cart[id].quantity);
  App.jModal.find(`.product-details [data-id="${id}"]`).fadeIn().find('span').text(App.cart[id].quantity);
  App.jModal.find(`.cart [data-id="${id}"]`).text(App.cart[id].quantity);
  const categoryId = App.products[id].category;
  if (App.cartCategoryQuantities[categoryId]) {
    App.cartCategoryQuantities[categoryId]++;
  } else {
    App.cartCategoryQuantities[categoryId] = 1;
  }
  App.jTabs.find(`[data-id=${categoryId}]`).fadeIn().find('span').text(App.cartCategoryQuantities[categoryId]);
  App.calculateCart();
  App.saveLocalCart();

  if (!App.jCheckoutButton.is(':visible')) {
    App.jCheckoutButton.fadeIn(() => {
      App.jCheckoutButton.css({ display: 'flex' });
    });
  }
};

App.decrementFromCart = (id) => {
  App.jOrderPreviewList.children().removeClass('last');
  if (App.cart[id]) {
    App.cart[id].quantity--;
    const existingOrderPreviewItem = App.jOrderPreviewList.find(`[data-id="${id}"]`).fadeIn().parent().parent().addClass('last');
    /*App.jOrderPreviewList.animate({
      scrollLeft: existingOrderPreviewItem.offset().left
    }, App.getAnimationTime());*/
    existingOrderPreviewItem.find('span').text(App.cart[id].quantity);
    App.jProducts.find(`[data-id="${id}"]`).find('span').text(App.cart[id].quantity);
    App.jModal.find(`.cart [data-id="${id}"]`).text(App.cart[id].quantity);
    App.jModal.find(`.cart-quantity-indicator[data-id="${id}"] span`).text(App.cart[id].quantity);
    if (App.cart[id].quantity <= 0) {
      delete App.cart[id];
      App.jProducts.find(`[data-id="${id}"]`).fadeOut();
      App.jOrderPreviewList.find(`[data-id="${id}"]`).parent().parent().fadeOut(function () {
        $(this).remove();
        if (!Object.keys(App.cart).length) {
          App.jCheckoutButton.fadeOut();
          App.jOrderPreview.fadeOut();
        }
      });
    }
    const categoryId = App.products[id].category;
    App.cartCategoryQuantities[categoryId]--;
    if (App.cartCategoryQuantities[categoryId] <= 0) {
      App.jTabs.find(`[data-id=${categoryId}]`).fadeOut();
    } else {
      App.jTabs.find(`[data-id=${categoryId}]`).find('span').text(App.cartCategoryQuantities[categoryId]);
    }
    App.saveLocalCart();
    App.calculateCart();
  }
};

App.removeFromCart = (id) => {
  App.jProducts.find(`[data-id="${id}"]`).fadeOut();
  App.jOrderPreviewList.find(`[data-id="${id}"]`).parent().parent().fadeOut(function () {
    $(this).remove();
  });
  const categoryId = App.products[id].category;
  App.cartCategoryQuantities[categoryId] -= App.cart[id].quantity;
  if (App.cartCategoryQuantities[categoryId] <= 0) {
    App.jTabs.find(`[data-id=${categoryId}]`).fadeOut();
  } else {
    App.jTabs.find(`[data-id=${categoryId}]`).find('span').text(App.cartCategoryQuantities[categoryId]);
  }
  delete App.cart[id];
  App.saveLocalCart();
  App.calculateCart();
};

App.removeAllFromCart = () => {
  App.cart = {};
  App.cartCategoryQuantities = {};
  App.jProducts.find('.cart-quantity-indicator').fadeOut();
  App.jTabs.find('.cart-quantity-indicator').fadeOut()
  App.jOrderPreviewList.children().fadeOut(function () {
    $(this).remove();
    App.jOrderPreview.fadeOut();
  });
  App.saveLocalCart();
  App.calculateCart();
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
  const itemText = App.getNumeralForm('misc_item', nItems);
  App.jModal.find('.cs-quantity').text(`${nItems} ${itemText}`);
  App.jModal.find('.cs-price').find('span').text(`${totalPrice.formatMoney()} ${App.settings.currency.symbol}`);
  App.jItemsCount.text(`${nItems} ${itemText}`);
  App.jTotal.text(totalPrice.formatMoney());
};

App.showCart = () => {
  const element = $(`<div class="cart"></div>`);
  const cartItems = $(`<div class="cart-items"></div>`);
  const cartKeys = Object.keys(App.cart);
  if (!cartKeys.length) {
    const emptyCartButton = $('<button class="btn btn-lg"><i class="material-icons">apps</i></button>').click(() => {
      App.closeModal();
    });
    cartItems.append(emptyCartButton);
  }
  cartKeys.forEach((id) => {
    const product = App.products[id];
    const cartItem = App.cart[id];
    const thisTotal = cartItem.quantity * product.price;
    const style = ` style="background-image: url(${App.imageUrlBase}${product.img})"`;
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
      el.find('button').prop('disabled', true);
      el.slideUp(App.getAnimationTime(), () => {
        el.remove();
        if (!Object.keys(App.cart).length) {
          App.closeModal();
          App.jCheckoutButton.fadeOut();
          App.jOrderPreview.fadeOut();
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
            App.closeModal();
            App.jCheckoutButton.fadeOut();
            App.jOrderPreview.fadeOut();
          }
        });
      }
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
      <div class="btn btn-primary cs-quantity">${nItems} ${App.getNumeralForm('misc_item', nItems)}</div>
      <button class="btn btn-primary btn-raised btn-lg cs-price">${App.lang.modal_cart_btn} <span>${totalPrice.formatMoney()} ${App.settings.currency.symbol}</span></button>
    </div>
  `);
  cartSummary.find('.cs-price').click(() => {
    App.closeModal();
    App.renderCheckoutScreen();
  });
  element.append(cartItems);
  element.append(cartSummary);
  App.showInModal(element, App.lang.modal_cart_title);
  const cancelButton = $(`
    <button class="btn btn-danger cs-cancel">${App.lang.modal_cart_cancel_btn}</button>;
  `).click(() => {
    App.removeAllFromCart();
    cartItems.empty();
    App.closeModal();
    App.jCheckoutButton.fadeOut();
    App.jTabs.children().eq(0).click();
  });
  if (App.jModal.find('.cs-cancel').length) {
    App.jModal.find('.cs-cancel').replaceWith(cancelButton);
  } else {
    App.jModal.find('.modal-footer').prepend(cancelButton);
  }
};
