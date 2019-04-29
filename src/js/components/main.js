App.renderMain = () => {
  App.renderTabs();
  App.jTabs.children().eq(0).click();
};

App.renderTabs = () => {
  const container = $('<div>');
  Object.keys(App.categories).forEach((key) => {
    const category = App.categories[key];
    const style = category.img ? `style="background-image: url(https://res.cloudinary.com/ceny24/image/upload/${category.img})"` : ``;
    const element = $(`
      <button class="btn btn-primary tab"${style}>
        <div class="tab-name">${category.name}</div>
      </div>`
    );
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
      App.renderProducts(key);
    });
    container.append(element);
  });
  App.jTabs.empty().append(container.children());
};

App.renderProducts = (category) => {
  const container = $('<div>');
  Object.keys(App.products).filter((key) => {
    return category === App.products[key].category;
  }).forEach((key) => {
    const product = App.products[key];
    const img = `https://res.cloudinary.com/ceny24/image/upload/${product.img}`;
    const element = $(`
      <div class="product">
        <div class="product-img" style="background-image: url(${img})"></div>
        <div class="product-name">${product.name}</div>
        <div class="product-control">
          <div class="product-price">${product.price}</div>
          <button class="btn btn-primary btn-raised">Buy</button>
        </div>
      </div>
    `);
    element.click(() => {
      console.log(product);
    });
    container.append(element);
  });
  App.jProducts.empty().append(container.children());
};

