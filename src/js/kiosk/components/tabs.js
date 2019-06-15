App.renderTabs = () => {
  const container = $('<div>');
  Object.keys(App.groups).forEach((id) => {
    const group = App.groups[id];
    const style = group.img ? ` style="background-image: url(${group.img.startsWith('http') ? '' : App.imageUrlBase}${group.img})"` : ``;
    const element = $(`
      <div class="btn btn-primary tab">
        <div class="tab-overlay"${style}></div>
        <div class="tab-name">${group.name}</div>
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
      App.jProducts.slideUp(() => {
        App.renderProducts(id);
      });
    });
    container.append(element);
  });
  App.jTabs.empty();
  App.jTabs.append(container.children());
  App.jTabs.children().each(function (i) {
    $(this).delay(i * (App.getAnimationTime() ? 100 : 0)).slideDown(App.getAnimationTime());
  });
  setTimeout(() => {
    App.jTabs.children().eq(App.activeTabPosition).click();
  }, Object.keys(App.groups).length * (App.getAnimationTime() ? 100 : 0));
};
