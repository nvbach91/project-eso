App.renderTabs = () => {
  const container = $('<div>');
  Object.keys(App.groups).forEach((id) => {
    const { img, name } = App.groups[id];
    const element = $(`
      <div class="btn btn-primary tab">
        <div class="tab-overlay"${App.getBackgroundImage(img)}></div>
        <div class="tab-name">${name}</div>
        <div class="btn btn-primary btn-raised${App.cartCategoryQuantities[id] ? '': ' hidden'} cart-quantity-indicator" data-id="${id}">
          ${App.getIcon('shopping_cart')}
          <span>${App.cartCategoryQuantities[id] || 0}</span>
        </div>
      </div>
    `).hide();
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
      App.activeTabPosition = element.index();
      //App.jProducts.slideUp(App.getAnimationTime(), () => {
        App.renderProducts(id);
      //});
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
