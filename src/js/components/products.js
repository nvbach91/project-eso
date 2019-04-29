App.renderProducts = (category) => {
  const container = $('<div>');
  Object.keys(App.products).filter((id) => {
    return category === App.products[id].category;
  }).forEach((id) => {
    const product = App.products[id];
    const img = `${App.config.imageUrlBase}${product.img}`;
    const element = $(`
      <div class="product-offer">
        <div class="po-img" style="background-image: url(${img})"><div class="btn"></div></div>
        <div class="po-name">${product.name}</div>
        <div class="po-control">
          <div class="po-price">${product.price} ${App.settings.currency.symbol}</div>
          <button class="btn btn-primary btn-raised">Buy</button>
        </div>
      </div>
    `);
    element.find('.po-img').click(() => {
      App.showProductDetail(id);
    });
    element.find('button').click((e) => {
      e.stopPropagation();
      App.addToCart(id);
    });
    container.append(element);
  });
  App.jProducts.empty().append(container.children());
};

App.showProductDetail = (id) => {
  const product = App.products[id];
  const img = `${App.config.imageUrlBase}${product.img}`;
  const element = $(`
    <div class="product-details">
      <div class="pd-img" style="background-image: url(${img})"></div>
      <div class="pd-details">
        <div class="pd-name">${product.name}</div>
        ${product.description ? `<div class="pd-description">${product.description}</div>` : ''}
        <div class="pd-control">
          <div class="pd-price">${product.price} ${App.settings.currency.symbol}</div>
          <button class="btn btn-primary btn-raised">Buy</button>
        </div>
      </div>
    </div>
  `);
  element.find('button').click(() => {
    App.addToCart(id);
  });
  App.showInModal(element);
};
