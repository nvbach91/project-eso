App.addToCart = (ean, mods, quantity, orderedId, inc) => {
  if (ean === 'T' && (!App.products[ean] || parseFloat(App.products[ean].price) <= 0)) {
    // dont add takeaway product if it doesn't exist or has zero price
    // a takeaway product is a special article with the ean === 'T'
    // it is automatically added if the delivery method is takeaway
    // with the same quantity as the added article's 
    return false;
  }
  const randomId = Math.random().toString(36).slice(-10);
  let id = orderedId ? orderedId : ean === 'T' ? ean : randomId;
  if (!orderedId) {
  // find an existing item that doesn't have any mod
    const existingCartItemId = Object.keys(App.cart)
      .filter((cid) => !App.cart[cid].mods.length)
      .find((cid) => App.cart[cid].ean === ean);
    id = existingCartItemId || id;
  }
  App.jOrderPreviewList.children().removeClass('last');

  const createNewPreviewItem = (_id) => {
    const cartItem = {
      id: _id,
      ean,
      quantity: typeof quantity === 'number' ? quantity : 1,
      mods,
    }
    App.cart[_id] = cartItem;
    const orderPreviewItem = App.createOrderPreviewItem(_id, ean).addClass('last').hide().fadeIn();
    if (ean === 'T') {
      App.jOrderPreviewList.append(orderPreviewItem);
    } else {
      App.jOrderPreviewList.prepend(orderPreviewItem);
    }
    
    // App.jOrderPreviewList.animate({
    //   scrollRight: orderPreviewItem.offset().right
    // }, App.getAnimationTime());
  };

  if (App.cart[id]) { // there is an item
    if (orderedId) { // previewItem clicked = modify, or inc clicked = increment
      if (inc) {
        App.cart[id].quantity += typeof quantity === 'number' ? quantity : 1;
      }
      App.cart[id].mods = mods;
    } else {
      if (!mods.length) {
        App.cart[id].quantity += typeof quantity === 'number' ? quantity : 1;
      } else {
        createNewPreviewItem(randomId);
      }
    }

    // if (id !== 'T' && mods.length) {
    //   App.cart[id].mods = mods;
    // }
  } else {
    createNewPreviewItem(id);
  }
  App.jOrderPreview.fadeIn();
  const existingOrderPreviewItem = App.jOrderPreviewList.find(`[data-id="${id}"]`).fadeIn().parent().parent().addClass('last');
  // App.jOrderPreviewList.animate({
  //   scrollLeft: existingOrderPreviewItem.offset().left
  // }, App.getAnimationTime());
  existingOrderPreviewItem.find('span').text(App.cart[id].quantity);
  // App.jProducts.find(`[data-id="${id}"]`).fadeIn().find('span').text(App.cart[id].quantity);
  // App.jModal.find(`.product-details [data-id="${id}"]`).fadeIn().find('span').text(App.cart[id].quantity);
  // App.jModal.find(`.cart [data-id="${id}"]`).text(App.cart[id].quantity);
  // const groupNumber = App.products[id].group;
  // if (App.cartCategoryQuantities[groupNumber]) {
  //   App.cartCategoryQuantities[groupNumber] += typeof quantity === 'number' ? quantity : 1;
  // } else {
  //   App.cartCategoryQuantities[groupNumber] = typeof quantity === 'number' ? quantity : 1;
  // }
  // App.jTabs.find(`[data-id="${groupNumber}"]`).fadeIn().find('span').text(App.cartCategoryQuantities[groupNumber]);
  App.calculateCart();
  App.saveLocalCart();

  if (!App.jCheckoutButton.is(':visible')) {
    App.jCheckoutButton.fadeIn(() => {
      App.jCheckoutButton.css({ display: 'flex' });
    });
  }
  if (App.deliveryMethod === 'takeout' && ean !== 'T') {
    App.addToCart('T', [], quantity);
  }
};

App.decrementFromCart = (id, ean) => {
  App.jOrderPreviewList.children().removeClass('last');
  if (App.cart[id]) {
    App.cart[id].quantity--;
    const existingOrderPreviewItem = App.jOrderPreviewList.find(`[data-id="${id}"]`).fadeIn().parent().parent().addClass('last');
    /*App.jOrderPreviewList.animate({
      scrollLeft: existingOrderPreviewItem.offset().left
    }, App.getAnimationTime());*/
    existingOrderPreviewItem.find('span').text(App.cart[id].quantity);
    // App.jProducts.find(`[data-id="${id}"]`).find('span').text(App.cart[id].quantity);
    // App.jModal.find(`.cart [data-id="${id}"]`).text(App.cart[id].quantity);
    // App.jModal.find(`.cart-quantity-indicator[data-id="${id}"] span`).text(App.cart[id].quantity);
    if (App.cart[id].quantity <= 0) {
      delete App.cart[id];
      // App.jProducts.find(`[data-id="${id}"]`).fadeOut();
      App.jOrderPreviewList.find(`[data-id="${id}"]`).parent().parent().fadeOut(function () {
        $(this).remove();
        if (!Object.keys(App.cart).length) {
          App.jCheckoutButton.fadeOut();
          App.jOrderPreview.fadeOut();
        }
      });
    }
    // const groupNumber = App.products[ean].group;
    // App.cartCategoryQuantities[groupNumber]--;
    // if (App.cartCategoryQuantities[groupNumber] <= 0) {
    //   App.jTabs.find(`[data-id=${groupNumber}]`).fadeOut();
    // } else {
    //   App.jTabs.find(`[data-id=${groupNumber}]`).find('span').text(App.cartCategoryQuantities[groupNumber]);
    // }
    App.saveLocalCart();
    App.calculateCart();
  }
  if (App.cart['T'] && id !== 'T') {
    App.decrementFromCart('T');
  }
};

App.removeFromCart = (id, ean) => {
  // App.jProducts.find(`[data-id="${id}"]`).fadeOut();
  App.jOrderPreviewList.find(`[data-id="${id}"]`).parent().parent().fadeOut(function () {
    $(this).remove();
  });
  // const groupNumber = App.products[ean].group;
  // App.cartCategoryQuantities[groupNumber] -= App.cart[id].quantity;
  // if (App.cartCategoryQuantities[groupNumber] <= 0) {
  //   App.jTabs.find(`[data-id=${groupNumber}]`).fadeOut();
  // } else {
  //   App.jTabs.find(`[data-id=${groupNumber}]`).find('span').text(App.cartCategoryQuantities[groupNumber]);
  // }
  if (App.cart['T'] && id !== 'T') {
    for (let i = 0; i < App.cart[id].quantity; i++) {
      App.decrementFromCart('T');
    }
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
  Object.keys(App.cart).forEach((id) => {
    const { ean, quantity, mods } = App.cart[id];
    if (ean === 'T') {
      nTakeouts += quantity;
    }
    const product = App.products[ean];
    let itemPrice = parseFloat(product.price);
    itemPrice = itemPrice - itemPrice * (product.discount || 0) / 100;
    if (mods) {
      mods.forEach((mod) => {
        itemPrice += (mod.quantity || 1) * mod.price;
      });
    }
    totalPrice += quantity * itemPrice;
    nItems += quantity;
  });
  // console.log(totalPrice);
  return { nItems, totalPrice, nTakeouts };
};

App.calculateCart = () => {
  const { nItems, totalPrice } = App.calculateCartSummaryValues();
  const itemText = App.getNumeralForm('misc_item', nItems);
  // App.jModal.find('.cs-quantity').text(`${nItems} ${itemText}`);
  // App.jModal.find('.cs-price').find('span').text(`${totalPrice.formatMoney()} ${App.settings.currency.symbol}`);
  App.jItemsCount.text(`${nItems} ${itemText}`);
  App.jTotal.text(totalPrice.formatMoney());
};

App.showCart = () => {
  if (App.deliveryMethod === 'takeout') {
    const { nItems, nTakeouts } = App.calculateCartSummaryValues();
    if (nItems > nTakeouts * 2) {
      App.addToCart('T', [], nItems - nTakeouts * 2);
    } else if (nItems < nTakeouts * 2) {
      for(let i = 0; i < nTakeouts * 2 - nItems; i++) {
        App.decrementFromCart('T');
      }
    }
  }
  const element = $(`<div class="cart"></div>`);
  const cartItems = $(`<div class="cart-items"></div>`);
  const cartKeys = Object.keys(App.cart);
  if (cartKeys.includes('T')) {
    cartKeys.push(cartKeys.splice(cartKeys.indexOf('T'), 1)[0]);
  }
  if (!cartKeys.length) {
    const emptyCartButton = $(`<button class="btn btn-lg">${App.getIcon('apps')}</button>`).click(() => {
      App.closeModal();
    });
    cartItems.append(emptyCartButton);
  }
  cartKeys.forEach((id) => {
    const { mods, quantity, ean } = App.cart[id];
    const { price, name, img } = App.products[ean];
    let finalPrice = parseFloat(price);
    mods.forEach((mod) => {
      finalPrice += (mod.quantity || 1) * mod.price;
    });
    let thisTotal = quantity * finalPrice;
    const el = $(`
      <div class="cart-item">
        <div class="ci-img"${App.getBackgroundImage(img)}></div>
        <div class="ci-info">
          <div class="ci-name"><strong>${name}</strong> <span class="badge badge-pill badge-primary">${price} ${App.settings.currency.symbol}</span></div>
          <div class="ci-mods">
            ${mods.length ? mods.map((m) => `
              <div class="ci-mod">
                &bull; ${parseFloat(m.price) ? `<span class="badge badge-pill badge-primary">${m.quantity}&times;</span>` : ''}
                ${parseFloat(m.price) ? `
                  <span class="badge badge-pill badge-primary">
                      +${m.price} ${App.settings.currency.symbol}
                  </span>
                ` : ''}
                ${App.mods[m.number] ? App.mods[m.number].name : `${m.number} - N/A`}
              </div>
            `).join('') : ''}
          </div>
        </div>
        <!--button class="btn btn-primary btn-dec"${ean === 'T' ? ' disabled' : ''}>-</button-->
        <div class="ci-quantity h5 text-primary" data-id="${id}" data-ean="${ean}">${quantity}&times; </div>
        <!--button class="btn btn-primary btn-inc"${ean === 'T' ? ' disabled' : ''}>+</button-->
        <div class="ci-price h5 text-primary">${finalPrice.formatMoney()} ${App.settings.currency.symbol}</div>
        <!--div class="ci-total">${thisTotal.formatMoney()}</div-->
        <!--button class="btn btn-primary ci-remove"${ean === 'T' ? ' disabled' : ''}>&times;</button-->
      </div>
    `);
    // el.find('.ci-remove').click(() => {
    //   App.removeFromCart(ean);
    //   el.find('button').prop('disabled', true);
    //   el.slideUp(App.getAnimationTime(), () => {
    //     el.remove();
    //     if (!Object.keys(App.cart).length) {
    //       App.closeModal();
    //       App.jCheckoutButton.fadeOut();
    //       App.jOrderPreview.fadeOut();
    //     }
    //   });
    // });
    // el.find('.btn-dec').click(() => {
    //   App.decrementFromCart(ean);
    //   if (!App.cart[ean]) {
    //     el.find('button').prop('disabled', true);
    //     el.fadeOut(() => {
    //       el.remove();
    //       if (!Object.keys(App.cart).length) {
    //         App.closeModal();
    //         App.jCheckoutButton.fadeOut();
    //         App.jOrderPreview.fadeOut();
    //       }
    //     });
    //   }
    // });
    // el.find('.btn-inc').click(() => {
    //   App.addToCart(ean);
    //   App.calculateCart();
    // });
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
    if (Offline.state === 'down') {
      return App.showWarning(`<h4 class="text-center">${App.lang.misc_device_is_offline}</h4>`);
    }
    App.closeModal();
    if (App.deliveryMethod === 'eatin' && App.settings.tableMarkers.active) {
      App.renderTableMarkerScreen();
    } else {
      App.renderCheckoutScreen();
    }
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
    App.tableMarkerValue = '';
  });
  if (App.jModal.find('.cs-cancel').length) {
    App.jModal.find('.cs-cancel').replaceWith(cancelButton);
  } else {
    App.jModal.find('.modal-footer').prepend(cancelButton);
  }
};
