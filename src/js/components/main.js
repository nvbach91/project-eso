require('./tabs.js');
require('./products.js');

App.renderModal = () => {
  const modal = $(`
    <div id="modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <!--button type="button" class="btn btn-primary" data-dismiss="modal">OK</button-->
          </div>
        </div>
      </div>
    </div>
  `);
  App.jModal.replaceWith(modal);
  App.jModal = modal;
};

App.renderOrderScreen = () => {
  const screen = $(`
    <main id="main" style="display: none">
      <div id="tabs"></div>
      <div id="products"></div>
    </main>
  `);
  
  setTimeout(() => {
    App.jMain.replaceWith(screen);
    App.jMain = screen;
    App.jProducts = screen.find('#products');
    App.jTabs = screen.find('#tabs');
    App.renderTabs();
    App.jTabs.children().eq(0).click();
    App.jMain.fadeIn();
  }, 500);
};

App.renderMain = () => {
  App.renderModal()
  App.renderPaymentChoiceScreen();
};


