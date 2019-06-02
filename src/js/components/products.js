App.renderProducts = (group) => {
  const container = $(`<div id="products">`);
  const header = $(`
    <div class="btn btn-primary btn-raised btn-lg products-header">
      <span>${App.groups[group].name}</span>
      <i class="material-icons">menu</i>
    </div>
  `).hide().appendTo(container);
  Object.keys(App.products).filter((id) => {
    return group === App.products[id].group;
  }).forEach((id) => {
    const product = App.products[id];
    const style = ` style="background-image: url(${App.imageUrlBase}${product.img})"`;
    const element = $(`
      <div class="product-offer${product.highlight ? ' highlight' : ''}">
        <div class="btn btn-raised po-img"${style}>
          <button class="btn btn-primary btn-raised${App.cart[id] ? '': ' hidden'} cart-quantity-indicator" data-id="${id}">
            <i class="material-icons">shopping_cart</i> 
            <span>${App.cart[id] ? App.cart[id].quantity : 0}</span>
          </button>
        </div>
        <div class="po-name">${product.name}</div>
        <div class="po-row">
          <div class="po-price">${product.price} ${App.settings.currency.symbol}</div>
          <div class="po-control">
            <button class="btn btn-primary add">
              <i class="material-icons">playlist_add</i>
            </button>
          </div>
        </div>
      </div>
    `);
    element.hide();
    element.find('.po-img').click(() => {
      App.showProductDetail(id);
    });
    element.find('.add').click((e) => {
      e.stopPropagation();
      App.addToCart(id);
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

App.showProductDetail = (id) => {
  const product = App.products[id];
  const style = ` style="background-image: url(${App.imageUrlBase}${product.img})"`;
  const element = $(`
    <div class="product-details">
      <div class="pd-img"${style}></div>
      <div class="pd-details">
        <div class="text-left">
          <div class="pd-name">${product.name}</div>
          ${product.description ? `<div class="pd-description">${product.description}</div>` : ''}
          <div class="pd-price">${product.price} ${App.settings.currency.symbol}</div>
        </div>
        <div class="pd-control text-left">
          <div class="pd-row justify-content-start">
            <button class="btn btn-primary${App.cart[id] ? '': ' hidden'} remove"><i class="material-icons">remove</i></button>
            <button class="btn btn-primary cart-quantity-indicator" data-id="${id}">
              <i class="material-icons">shopping_cart</i> 
              <span>${App.cart[id] ? App.cart[id].quantity : 0}</span>
            </button>
            <button class="btn btn-primary add"><i class="material-icons">add</i></button>
          </div>
          <button class="btn btn-raised btn-primary order">
            <span>${App.lang.order_products_order_btn}</span>&nbsp;
            <i class="material-icons">playlist_add</i>
          </button>
        </div>
      </div>
    </div>
  `);
  element.find('.cart-quantity-indicator').click((e) => {
    App.showCart();
  });
  element.find('.remove').click(() => {
    App.decrementFromCart(id);
    if (!App.cart[id]) {
      setTimeout(() => {
        App.closeModal();
      }, App.getAnimationTime());
    }
  });
  element.find('.add').click(() => {
    App.addToCart(id);
    element.find('.remove').removeClass('hidden');
  });
  element.find('.order').click(() => {
    if (!App.cart[id]) {
      App.addToCart(id);
    }
    App.closeModal();
    App.nextTab();
  });
  App.showInModal(element, 'Product details');
  App.jModal.find('.cs-cancel').remove();
};
