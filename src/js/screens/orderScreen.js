
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
  if (Object.keys(App.cart).length) {
    App.jCheckoutButton.hide().fadeIn().css({ display: 'flex' });
    App.jCartControl.css({ display: 'flex' }).hide().fadeIn(() => {
      App.renderTabs();
      App.jBackButton.fadeIn().off('click').click(() => {
        App.renderDiningChoiceScreen();
      });
    });
  } else {
    App.renderTabs();
    App.jBackButton.fadeIn().off('click').click(() => {
      App.renderDiningChoiceScreen();
    });
  }
};
