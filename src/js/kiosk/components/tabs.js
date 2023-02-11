App.renderTabs = () => {
  const container = $('<div>');
  Object.keys(App.groups).sort((a, b) => App.groups[a].position - App.groups[b].position).forEach((groupNumber) => {
    const { img, name, display } = App.groups[groupNumber];
    if (!display) {
      return false;
    }
    const element = $(`
      <div class="btn btn-primary${App.settings.theme === 'dark' ? ' btn-raised' : ''} tab">
        <div class="tab-overlay"${App.getBackgroundImage(img)}></div>
        <div class="tab-name">
          <div class="ribbon-wrapper">
            <div class="ribbon-front">
              <div class="glow-flow">&nbsp;</div>
              <span>${name}</span>
            </div>
            <div class="ribbon-edge-topleft"></div>
            <div class="ribbon-edge-topright"></div>
            <div class="ribbon-edge-bottomleft"></div>
            <div class="ribbon-edge-bottomright"></div>
          </div>
        </div>
        <!--div class="btn btn-primary btn-raised${App.cartCategoryQuantities[groupNumber] ? '': ' hidden'} cart-quantity-indicator" data-id="${groupNumber}">
          ${App.getIcon('shopping_cart')}
          <span>${App.cartCategoryQuantities[groupNumber] || 0}</span>
        </div-->
      </div>
    `).hide();
    element.click(() => {
      element.addClass('selected').blur();
      element.siblings().removeClass('selected');
      App.activeTabPosition = element.index();
      //App.jProducts.slideUp(App.getAnimationTime(), () => {
        App.renderProducts(groupNumber);
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
