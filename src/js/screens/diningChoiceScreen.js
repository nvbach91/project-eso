App.renderDiningChoiceScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="screen dining-choices">
        <div class="card full-width-card">
          <h5 class="card-header">${App.lang.dining_choice_welcome_title}</h5>
          <div class="card-body">
            <h5 class="card-title">Daily offer: special on-the-house treatment</h5>
            <p class="card-text">Order 5 get 1 free</p>
            <button class="btn btn-primary">${App.lang.dining_choice_special_offer_btn}</button>
          </div>
        </div>
        <br>
        <div class="selection">
          ${Object.keys(App.diningChoices).map((key) => {
            const dc = App.diningChoices[key];
            return `
              <div class="card" data-method="${key}">
                <div class="btn card-img-top" style="background-image: url(${dc.img})"></div>
                <div class="card-body">
                  <h5 class="card-title">${dc.title}</h5>
                  <p class="card-text">${dc.text}</p>
                  <button class="btn ${dc.btn.class} btn-raised">${dc.btn.text}</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </main>
  `);
  screen.find('.selection .card').click(function () {
    App.diningChoice = $(this).data('method');
    if(App.diningChoice === "take-out") {
      App.jDiningChoiceIndicator.text(App.GLocaleEN.dining_choice_take_out_title);
    } else {
      App.jDiningChoiceIndicator.text(App.GLocaleEN.dining_choice_eat_in_title);
    }
    App.renderOrderScreen();
  });
  App.jBackButton.fadeIn().off('click').click(() => {
    App.reset();
  });
  screen.hide();
  screen.find('.card').hide();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn(() => {
    screen.find('.card').slideDown();
  });
  App.jLocaleSwitcher.fadeOut();
  App.startActivitySession();
};
