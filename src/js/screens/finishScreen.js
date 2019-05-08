App.renderFinishScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="screen finish-screen">
        <div class="card full-width-card">
          <h5 class="card-header">
            <span>Thank you very much!</span>
            <button class="btn btn-primary btn-raised start-new">Start a new order</button>
          </h5>
          <div class="card-body">
            <p>Please take your receipt and wait for your number to be called</p>
            <h5 class="card-title">Did you know?</h5>
            <button class="btn btn-primary dyk-text">&nbsp;</button>
          </div>
        </div>
      </div>
    </main>
  `);
  App.showSpinner();
  App.fetchJoke().done((resp) => {
    screen.find('.dyk-text').html(resp);
  }).always(() => {
    App.hideSpinner();
  });
  const resetTimeout = setTimeout(() => startNewButton.click(), 10000);
  const startNewButton = screen.find('.start-new').click(() => {
    clearTimeout(resetTimeout);
    App.reset();
  });
  //screen.hide();
  screen.find('.card').hide();
  App.jCartControl.fadeOut();
  App.jCheckoutButton.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  //App.jMain.fadeIn();
  App.jMain.find('.card').slideDown();
};
