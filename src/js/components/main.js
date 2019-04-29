require('./tabs.js');
require('./products.js');

App.renderMain = () => {
  App.renderTabs();
  App.jTabs.children().eq(0).click();
};

