App.renderTabs = () => {
  const container = $('<div>');
  Object.keys(App.categories).forEach((key) => {
    const category = App.categories[key];
    const style = category.img ? ` style="background-image: url(${App.config.imageUrlBase}${category.img})"` : ``;
    const element = $(`
      <button class="btn btn-primary tab"${style}>
        <div class="tab-name">${category.name}</div>
      </div>
    `);
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
      App.renderProducts(key);
    });
    container.append(element);
  });
  App.jTabs.empty().append(container.children());
};
