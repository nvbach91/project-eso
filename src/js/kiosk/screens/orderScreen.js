
App.renderOrderScreen = () => {
  const screen = $(`
    <main id="main">
      <div id="tabs"></div>
      <div id="products"></div>
    </main>
  `);
  App.showSpinner();
  App.jProducts = screen.find('#products');
  App.jTabs = screen.find('#tabs');
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jDeliveryMethodIndicator.hide().fadeIn();
  if (Object.keys(App.cart).length) {
    App.jCheckoutButton.fadeIn(() => {
      App.jCheckoutButton.css({ display: 'flex' });
    });
  }
  App.renderTabs();
  App.jBackButton.fadeIn().off('click').click(() => {
    App.renderDeliveryMethodScreen();
  });
  App.renderOrderPreview();
};

App.renderOrderPreview = () => {
  App.jOrderPreview.remove();
  const { nItems, totalPrice } = App.calculateCartSummaryValues();
  const orderPreview = $(`
    <div id="order-preview">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <span class="navbar-brand">${App.lang.modal_cart_title}</span>
        <ul id="cart-control" class="navbar-nav">
          <li class="nav-item active" id="cart-indicator">
            <span id="items-count" class="badge badge-pill badge-light">${nItems} ${App.getNumeralForm('misc_item', nItems)}</span>
            <a class="nav-link" href="#">
              <span>&sum;</span>&nbsp;
              <span id="total">${totalPrice.formatMoney()}</span> ${App.settings.currency.symbol}
            </a>
          </li>
        </ul>
      </nav>
      <div id="op-list"></div>
    </div>
  `);
  App.jOrderPreview = orderPreview;
  App.jOrderPreviewList = orderPreview.children('#op-list');
  App.jTotal = orderPreview.find('#total');
  App.jItemsCount = orderPreview.find('#items-count');

  const cartKeys = Object.keys(App.cart);
  cartKeys.forEach((ean) => {
    const el = App.createOrderPreviewItem(ean);
    App.jOrderPreviewList.append(el);
  });
  orderPreview.find('#cart-indicator').click(() => {
    App.showCart();
  });
  App.jMain.after(orderPreview);
  if (Object.keys(App.cart).length) {
    orderPreview.fadeIn();
  }
};

App.createOrderPreviewItem = (ean) => {
  const { img } = App.products[ean];
  const el = $(`
    <div class="op-item">
      <div class="op-img"${App.getBackgroundImage(img)}>
        <button class="btn btn-primary btn-raised${App.cart[ean] ? '' : ' hidden'} cart-quantity-indicator" data-id="${ean}">
          ${App.getIcon('shopping_cart')}
          <span>${App.cart[ean] ? App.cart[ean].quantity : 0}</span>
        </button>
      </div>
      <div class="op-control">
        <button class="btn btn-primary op-inc"${ean === 'T' ? ' disabled' : ''}>${App.getIcon('add')}</button>
        <button class="btn btn-primary op-dec"${ean === 'T' ? ' disabled' : ''}>${App.getIcon('remove')}</button>
      </div>
    </div>
  `);
  el.find('.op-img').click(() => {
    App.showProductDetail(ean);
  });
  el.find('.op-inc').click(() => {
    App.addToCart(ean);
  });
  el.find('.op-dec').click(() => {
    App.decrementFromCart(ean);
  });
  return el;
};