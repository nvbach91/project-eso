require('./tabs.js');
require('./products.js');

App.renderModal = () => {
  const modal = $(`
    <div id="modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
            <button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close" data-dismiss="modal">${App.lang.misc_close_btn}</button>
          </div>
        </div>
      </div>
    </div>
  `);
  App.jModal.replaceWith(modal);
  App.jModal = modal;
};

App.renderSpinner = () => {
  const spinner = $(`
    <div id="spinner">
      <div class="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `);
  App.jSpinner.replaceWith(spinner);
  App.jSpinner = spinner;
  App.jSpinner.hide();
};

App.renderMain = () => {
  App.renderStandbyScreen();
};


