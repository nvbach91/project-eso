App.renderProducts = (category) => {
  const container = $('<div id="products">');
  Object.keys(App.products).filter((id) => {
    return category === App.products[id].category;
  }).forEach((id) => {
    const product = App.products[id];
    const style = ` style="background-image: url(${App.imageUrlBase}${product.img})"`;
    const element = $(`
      <div class="product-offer">
        <div class="btn btn-raised po-img"${style}>
          <button class="btn btn-warning btn-raised${App.cart[id] ? '': ' hidden'} cart-quantity-indicator" data-id="${id}">
            <i class="material-icons">shopping_cart</i> 
            <span>${App.cart[id] ? App.cart[id].quantity : 0}</span>
          </button>
        </div>
        <div class="po-name">${product.name}</div>
        <div class="po-row">
          <div class="po-price">${product.price} ${App.settings.currency.symbol}</div>
          <div class="po-control">
            <button class="btn btn-primary btn-raised add">
              <i class="material-icons">bookmark_border</i>
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    `).hide();
    element.find('.po-img').click(() => {
      App.showProductDetail(id);
    });
    element.find('.add').click((e) => {
      e.stopPropagation();
      App.addToCart(id);
    });
    const cartQuantityIndicator = element.find('.cart-quantity-indicator');
    cartQuantityIndicator.click((e) => {
      e.stopPropagation();
      App.showCart();
    });
    container.append(element);
  });
  //container.hide();
  App.jProducts.replaceWith(container);
  App.jProducts = container;
  //App.jProducts.fadeIn(() => {
    App.jProducts.children().slideDown();
    App.hideSpinner();
  //});
};

App.showProductDetail = (id) => {
  const product = App.products[id];
  const style = ` style="background-image: url(${App.imageUrlBase}${product.img})"`;
  const element = $(`
    <div class="product-details">
      <div class="pd-img"${style}></div>
      <div class="pd-details">
        <div class="pd-name">${product.name}</div>
        ${product.description ? `<div class="pd-description">${product.description}</div>` : ''}
        <div class="pd-row">
          <div class="pd-price">${product.price} ${App.settings.currency.symbol}</div>
          <div class="pd-control">
            <button class="btn btn-warning btn-raised${App.cart[id] ? '': ' hidden'} cart-quantity-indicator" data-id="${id}">
              <i class="material-icons">shopping_cart</i> 
              <span>${App.cart[id] ? App.cart[id].quantity : 0}</span>
            </button>
            <button class="btn btn-primary btn-raised add">
              <i class="material-icons">bookmark_border</i>
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
  element.find('.cart-quantity-indicator').click((e) => {
    App.showCart();
  });
  element.find('.add').click(() => {
    App.addToCart(id);
  });
  App.showInModal(element, 'Product details');
  App.jModal.find('.cs-cancel').remove();
};
