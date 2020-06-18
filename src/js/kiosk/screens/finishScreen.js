App.renderFinishScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="screen finish-screen">
        <div class="card full-width-card">
          <h5 class="card-header">
            <span>${App.lang.finish_header_title}</span>
            <button class="btn btn-primary btn-raised start-new">${App.lang.finish_header_btn}</button>
          </h5>
          <div class="card-body">
            <p class="text-center">${App.getIcon(`${App.imageUrlBase}${App.settings.theme === 'dark' ? 'rec_irraiu' : 'receipt_rkkwuo'}`, 200)} ${App.lang.finish_body_title}</p>
          </div>
        </div>
      </div>
    </main>
  `);
  // <h5 class="card-title">${App.lang.finish_body_question}</h5>
  // <button class="btn btn-primary dyk-text">&nbsp;</button>
  // App.fetchJoke().done((resp) => {
  //   screen.find('.dyk-text').html(resp);
  // });
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
