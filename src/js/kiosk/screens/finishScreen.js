const createFinishMessage = () => {
  return !App.settings.finishMessage ? '' : `
    <div class="card-footer">
      <h4 class="text-center">${App.settings.finishMessage}</h4>
    </div>
  `;
};

App.renderFinishScreen = (newTransaction) => {
  const screen = $(`
    <main id="main">
      <div class="screen finish-screen">
        <div class="card full-width-card">
          <h5 class="card-header">
            <span>${App.lang.finish_header_title}</span>
            <button class="btn btn-primary btn-raised start-new">${App.lang.finish_header_btn}</button>
          </h5>
          <div class="card-body">
            <div class="text-center">
              <div class="row justify-content-md-center align-items-md-center">
                <span class="receipt-icon">
                  ${App.getIcon(`${App.imageUrlBase}${App.settings.theme === 'dark' ? 'receipt-dark_zkkrws' : 'receipt-white_y8xmiy'}`, 200)}
                  <strong class="order-number">${App.settings.receipt.orderPrefix}${newTransaction.order}</strong>
                </span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h4 class="text-center">${App.lang.finish_body_title}</h4>
          </div>
          ${createFinishMessage()}
        </div>
      </div>
    </main>
  `);
  // <h5 class="card-title">${App.lang.finish_body_question}</h5>
  // <button class="btn btn-primary dyk-text">&nbsp;</button>
  // App.fetchJoke().done((resp) => {
  //   screen.find('.dyk-text').html(resp);
  // });
  
  App.cart = {};
  App.cartCategoryQuantities = {};
  App.saveLocalCart();
  const resetTimeout = setTimeout(() => startNewButton.click(), 20000);
  const startNewButton = screen.find('.start-new').click(() => {
    clearTimeout(resetTimeout);
    App.reset();
  });
  screen.find('.card').hide();
  App.jCheckoutButton.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.find('.card').slideDown(App.getAnimationTime());
};
