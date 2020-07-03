App.addToCart = (ean, mods, quantity) => {
  App.jOrderPreviewList.children().removeClass('last');
  if (App.cart[ean]) {
    App.cart[ean].quantity += typeof quantity === 'number' ? quantity : 1;
  } else {
    App.cart[ean] = {
      quantity: typeof quantity === 'number' ? quantity : 1,
    };
    const orderPreviewItem = App.createOrderPreviewItem(ean);
    App.jOrderPreviewList.append(orderPreviewItem.addClass('last').hide().fadeIn());
    
    App.jOrderPreviewList.animate({
      scrollLeft: orderPreviewItem.offset().left
    }, App.getAnimationTime());
  }
  if (mods) {
    App.cart[ean].mods = mods;
  }
  App.jOrderPreview.fadeIn();
  const existingOrderPreviewItem = App.jOrderPreviewList.find(`[data-id="${ean}"]`).fadeIn().parent().parent().addClass('last');
  /*App.jOrderPreviewList.animate({
    scrollLeft: existingOrderPreviewItem.offset().left
  }, App.getAnimationTime());*/
  existingOrderPreviewItem.find('span').text(App.cart[ean].quantity);
  App.jProducts.find(`[data-id="${ean}"]`).fadeIn().find('span').text(App.cart[ean].quantity);
  App.jModal.find(`.product-details [data-id="${ean}"]`).fadeIn().find('span').text(App.cart[ean].quantity);
  App.jModal.find(`.cart [data-id="${ean}"]`).text(App.cart[ean].quantity);
  const groupNumber = App.products[ean].group;
  if (App.cartCategoryQuantities[groupNumber]) {
    App.cartCategoryQuantities[groupNumber] += typeof quantity === 'number' ? quantity : 1;
  } else {
    App.cartCategoryQuantities[groupNumber] = typeof quantity === 'number' ? quantity : 1;
  }
  App.jTabs.find(`[data-id=${groupNumber}]`).fadeIn().find('span').text(App.cartCategoryQuantities[groupNumber]);
  App.calculateCart();
  App.saveLocalCart();

  if (!App.jCheckoutButton.is(':visible')) {
    App.jCheckoutButton.fadeIn(() => {
      App.jCheckoutButton.css({ display: 'flex' });
    });
  }
};

App.decrementFromCart = (ean) => {
  App.jOrderPreviewList.children().removeClass('last');
  if (App.cart[ean]) {
    App.cart[ean].quantity--;
    const existingOrderPreviewItem = App.jOrderPreviewList.find(`[data-id="${ean}"]`).fadeIn().parent().parent().addClass('last');
    /*App.jOrderPreviewList.animate({
      scrollLeft: existingOrderPreviewItem.offset().left
    }, App.getAnimationTime());*/
    existingOrderPreviewItem.find('span').text(App.cart[ean].quantity);
    App.jProducts.find(`[data-id="${ean}"]`).find('span').text(App.cart[ean].quantity);
    App.jModal.find(`.cart [data-id="${ean}"]`).text(App.cart[ean].quantity);
    App.jModal.find(`.cart-quantity-indicator[data-id="${ean}"] span`).text(App.cart[ean].quantity);
    if (App.cart[ean].quantity <= 0) {
      delete App.cart[ean];
      App.jProducts.find(`[data-id="${ean}"]`).fadeOut();
      App.jOrderPreviewList.find(`[data-id="${ean}"]`).parent().parent().fadeOut(function () {
        $(this).remove();
        if (!Object.keys(App.cart).length) {
          App.jCheckoutButton.fadeOut();
          App.jOrderPreview.fadeOut();
        }
      });
    }
    const groupNumber = App.products[ean].group;
    App.cartCategoryQuantities[groupNumber]--;
    if (App.cartCategoryQuantities[groupNumber] <= 0) {
      App.jTabs.find(`[data-id=${groupNumber}]`).fadeOut();
    } else {
      App.jTabs.find(`[data-id=${groupNumber}]`).find('span').text(App.cartCategoryQuantities[groupNumber]);
    }
    App.saveLocalCart();
    App.calculateCart();
  }
};

App.removeFromCart = (ean) => {
  App.jProducts.find(`[data-id="${ean}"]`).fadeOut();
  App.jOrderPreviewList.find(`[data-id="${ean}"]`).parent().parent().fadeOut(function () {
    $(this).remove();
  });
  const groupNumber = App.products[ean].group;
  App.cartCategoryQuantities[groupNumber] -= App.cart[ean].quantity;
  if (App.cartCategoryQuantities[groupNumber] <= 0) {
    App.jTabs.find(`[data-id=${groupNumber}]`).fadeOut();
  } else {
    App.jTabs.find(`[data-id=${groupNumber}]`).find('span').text(App.cartCategoryQuantities[groupNumber]);
  }
  delete App.cart[ean];
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
  let nTakeouts = 0;
  Object.keys(App.cart).forEach((ean) => {
    if (ean === 'T') {
      nTakeouts += App.cart[ean].quantity;
    }
    const product = App.products[ean];
    const cartItem = App.cart[ean];
    let itemPrice = parseFloat(product.price);
    itemPrice = itemPrice - itemPrice * (product.discount || 0) / 100;
    if (cartItem.mods) {
      cartItem.mods.forEach((mod) => {
        itemPrice += parseFloat(mod.price);
      });
    }
    totalPrice += cartItem.quantity * itemPrice;
    nItems += cartItem.quantity;
  });
  // console.log(totalPrice);
  return { nItems, totalPrice, nTakeouts };
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
  if (App.deliveryMethod === 'takeout') {
    const { nItems, nTakeouts } = App.calculateCartSummaryValues();
    if (nItems > nTakeouts * 2) {
      App.addToCart('T', null, nItems - nTakeouts * 2);
    } else if (nItems < nTakeouts * 2) {
      for(let i = 0; i < nTakeouts * 2 - nItems; i++) {
        App.decrementFromCart('T');
      }
    }
  }
  const element = $(`<div class="cart"></div>`);
  const cartItems = $(`<div class="cart-items"></div>`);
  const cartKeys = Object.keys(App.cart);
  if (!cartKeys.length) {
    const emptyCartButton = $(`<button class="btn btn-lg">${App.getIcon('apps')}</button>`).click(() => {
      App.closeModal();
    });
    cartItems.append(emptyCartButton);
  }
  cartKeys.forEach((ean) => {
    const { price, name, img } = App.products[ean];
    const cartItem = App.cart[ean];
    let finalPrice = parseFloat(price);
    if (cartItem.mods) {
      cartItem.mods.forEach((mod) => {
        finalPrice += parseFloat(mod.price);
      });
    }
    let thisTotal = cartItem.quantity * finalPrice;
    const el = $(`
      <div class="cart-item">
        <div class="ci-img"${App.getBackgroundImage(img)}></div>
        <div class="ci-name">
          ${name} 
          ${cartItem.mods ? 
            `- ${cartItem.mods.map((m) => 
                `${App.mods[m.number] ? App.mods[m.number].name : `${m.number} - N/A`}${parseFloat(m.price) ? ` +${m.price} ${App.settings.currency.symbol}` : ''}`
              ).join(', ')}`
            : ''}
        </div>
        <button class="btn btn-primary btn-dec"${ean === 'T' ? ' disabled' : ''}>-</button>
        <div class="ci-quantity" data-id="${ean}">${cartItem.quantity}</div>
        <button class="btn btn-primary btn-inc"${ean === 'T' ? ' disabled' : ''}>+</button>
        <div class="ci-price">${finalPrice.formatMoney()}</div>
        <!--div class="ci-total">${thisTotal.formatMoney()}</div-->
        <button class="btn btn-primary ci-remove"${ean === 'T' ? ' disabled' : ''}>&times;</button>
      </div>
    `);
    el.find('.ci-remove').click(() => {
      App.removeFromCart(ean);
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
      App.decrementFromCart(ean);
      if (!App.cart[ean]) {
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
      App.addToCart(ean);
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
