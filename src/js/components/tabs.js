App.renderTabs = () => {
  const container = $('<div>');
  Object.keys(App.categories).forEach((id) => {
    const category = App.categories[id];
    const style = category.img ? ` style="background-image: url(${category.img.startsWith('http') ? '' : App.imageUrlBase}${category.img})"` : ``;
    const element = $(`
      <button class="btn btn-primary tab">
        <div class="tab-overlay"${style}></div>
        <div class="tab-name">${category.name}</div>
        <div class="btn btn-primary btn-raised${App.cartCategoryQuantities[id] ? '': ' hidden'} cart-quantity-indicator" data-id="${id}">
          <i class="material-icons">shopping_cart</i> 
          <span>${App.cartCategoryQuantities[id] || 0}</span>
        </div>
      </div>
    `).hide();
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
      App.activeTabPosition = element.index();
      App.renderProducts(id);
    });
    container.append(element);
  });
  //App.jTabs.hide();
  App.jTabs.empty();
  App.jTabs.append(container.children());//.fadeIn(() => {
    App.jTabs.children().slideDown(() => {
      App.jTabs.children().eq(App.activeTabPosition).click();
    });
  //});
};
