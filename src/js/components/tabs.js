App.renderTabs = () => {
  const container = $('<div>');
  Object.keys(App.categories).forEach((id) => {
    const category = App.categories[id];
    const style = category.img ? ` style="background-image: url(${App.imageUrlBase}${category.img})"` : ``;
    const element = $(`
      <button class="btn btn-primary btn-raised tab">
        <div class="tab-overlay"${style}></div>
        <div class="tab-name">${category.name}</div>
        <div class="btn btn-warning btn-raised${App.cartCategoryQuantities[id] ? '': ' hidden'} cart-quantity-indicator" data-id="${id}">
          <i class="material-icons">shopping_cart</i> 
          <span>${App.cartCategoryQuantities[id] || 0}</span>
        </div>
      </div>
    `);
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
      App.activeTabPosition = element.index();
      App.renderProducts(id);
    });
    container.append(element);
  });
  App.jTabs.hide().empty().append(container.children()).fadeIn(() => {
    App.jTabs.children().eq(App.activeTabPosition).click();
  });
};
