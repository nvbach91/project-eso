
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
  App.jDiningChoiceIndicator.css({ display: 'flex' }).hide().fadeIn();
  if (Object.keys(App.cart).length) {
    App.jCheckoutButton.hide().fadeIn().css({ display: 'flex' });
    App.renderTabs();
    App.jBackButton.fadeIn().off('click').click(() => {
      App.renderDiningChoiceScreen();
    });
  } else {
    App.renderTabs();
    App.jBackButton.fadeIn().off('click').click(() => {
      App.renderDiningChoiceScreen();
    });
  }
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
              <span>Σ</span>&nbsp;
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
  cartKeys.forEach((id) => {
    const el = App.createOrderPreviewItem(id);
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

App.createOrderPreviewItem = (id) => {
  const product = App.products[id];
  const style = ` style="background-image: url(${App.imageUrlBase}${product.img})"`;
  const el = $(`
    <div class="op-item">
      <div class="op-img"${style}>
        <button class="btn btn-primary btn-raised${App.cart[id] ? '' : ' hidden'} cart-quantity-indicator" data-id="${id}">
          <i class="material-icons">shopping_cart</i> 
          <span>${App.cart[id] ? App.cart[id].quantity : 0}</span>
        </button>
      </div>
      <div class="op-control">
        <button class="btn btn-primary op-inc"><i class="material-icons">add</i></button>
        <button class="btn btn-primary op-dec"><i class="material-icons">remove</i></button>
      </div>
    </div>
  `);
  el.find('.op-img').click(() => {
    App.showProductDetail(id);
  });
  el.find('.op-inc').click(() => {
    App.addToCart(id);
  });
  el.find('.op-dec').click(() => {
    App.decrementFromCart(id);
  });
  return el;
};