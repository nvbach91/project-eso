App.renderProducts = (group) => {
  const container = $(`<div id="products">`);
  const header = $(`
    <div class="btn btn-primary btn-raised btn-lg products-header">
      <span>${App.groups[group].name}</span>
      ${App.getIcon('menu')}
    </div>
  `);
  header.appendTo(container);
  Object.keys(App.products).filter((ean) => {
    return group == App.products[ean].group;
  }).sort((a, b) => App.products[a].order - App.products[b].order).forEach((ean) => {
    const { highlight, img, name, price, order } = App.products[ean];
    const element = $(`
      <div class="product-offer${highlight ? ' highlight' : ''}" title="${ean} - ${order || 0}">
        <div class="btn btn-raised po-img"${App.getBackgroundImage(img)}>
          <button class="btn btn-primary btn-raised${App.cart[ean] ? '': ' hidden'} cart-quantity-indicator" data-id="${ean}">
            ${App.getIcon('shopping_cart')}
            <span>${App.cart[ean] ? App.cart[ean].quantity : 0}</span>
          </button>
        </div>
        <div class="po-name">${name}</div>
        <div class="po-row">
          <div class="po-price">${price} ${App.settings.currencySymbol}</div>
          <div class="po-control">
            <button class="btn btn-primary add">
              ${App.getIcon('playlist_add')}
            </button>
          </div>
        </div>
      </div>
    `);
    element.hide();
    element.find('.po-img').click(() => {
      App.showProductDetail(ean);
    });
    element.find('.add').click((e) => {
      e.stopPropagation();
      App.addToCart(ean);
      App.nextTab();
    });
    const cartQuantityIndicator = element.find('.cart-quantity-indicator');
    cartQuantityIndicator.click((e) => {
      e.stopPropagation();
      App.showCart();
    });
    container.append(element);
  });
  App.jProducts.replaceWith(container);
  App.jProducts = container;
  App.jProducts.children().each(function (i) {
    $(this).delay(i * (App.getAnimationTime() ? 100 : 0)).slideDown(App.getAnimationTime());
  });
  App.hideSpinner();
};

App.showProductDetail = (ean) => {
  const { img, name, price, desc } = App.products[ean];
  const element = $(`
    <div class="product-details">
      <div class="pd-img"${App.getBackgroundImage(img)}></div>
      <div class="pd-details">
        <div class="text-left">
          <div class="pd-name">${name}</div>
          ${desc ? `<textarea disabled class="pd-description">${desc}</textarea>` : ''}
          <div class="pd-price">${price} ${App.settings.currencySymbol}</div>
        </div>
        <div class="pd-control text-left">
          <div class="pd-row justify-content-start">
            <button class="btn btn-primary${App.cart[ean] ? '': ' hidden'} remove">${App.getIcon('remove')}</button>
            <button class="btn btn-primary cart-quantity-indicator" data-id="${ean}">
              ${App.getIcon('shopping_cart')}
              <span>${App.cart[ean] ? App.cart[ean].quantity : 0}</span>
            </button>
            <button class="btn btn-primary add">${App.getIcon('add')}</button>
          </div>
          <button class="btn btn-raised btn-primary order">
            <span>${App.lang.order_products_order_btn}</span>&nbsp;
            ${App.getIcon('playlist_add')}
          </button>
        </div>
      </div>
    </div>
  `);
  if (desc) { // resizing the description textbox
    const descriptionContainer = element.find('.pd-description')[0];
    const nLines = desc.split(/\r\n/).length;
    descriptionContainer.style.height = `${nLines * 22}px`;
  }
  element.find('.cart-quantity-indicator').click((e) => {
    App.showCart();
  });
  element.find('.remove').click(() => {
    App.decrementFromCart(ean);
    if (!App.cart[ean]) {
      setTimeout(() => {
        App.closeModal();
      }, App.getAnimationTime());
    }
  });
  element.find('.add').click(() => {
    App.addToCart(ean);
    element.find('.remove').removeClass('hidden');
  });
  element.find('.order').click(() => {
    if (!App.cart[ean]) {
      App.addToCart(ean);
    }
    App.closeModal();
    App.nextTab();
  });
  App.showInModal(element, 'Product details');
  App.jModal.find('.cs-cancel').remove();
};
