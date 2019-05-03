App.diningChoices = {
  'eat-in': { 
    title: 'Eat in',
    text: 'Let\'s enjoy the atmosphere in our restaurant',
    btn: { text: 'I\'ll eat here', class: 'btn-primary' },
    img: 'https://media1.s-nbcnews.com/j/streams/2014/October/141006/2D274906938828-today-cafeteria-140811-01.fit-760w.jpg',
  },
  'take-out': { 
    title: 'Take out',
    text: 'I want to pack my meal',
    btn: { text: 'I\'ll take it home', class: 'btn-warning' },
    img: 'https://www.sld.com/wp-content/uploads/2017/03/1280x480RestaurantTakeOut.jpg',
  },
};
App.renderDiningChoiceScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="screen dining-choices">
        <div class="card full-width-card">
          <h5 class="card-header">Welcome!</h5>
          <div class="card-body">
            <h5 class="card-title">Daily offer: special on-the-house treatment</h5>
            <p class="card-text">Order 5 get 1 free</p>
            <button class="btn btn-primary">Show me!</button>
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
    App.jDiningChoiceIndicator.text(App.diningChoices[App.diningChoice].title);
    App.renderOrderScreen();
  });
  App.jBackButton.fadeIn().off('click').click(() => {
    App.reset();
  });
  screen.hide();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn();
  App.jLocaleSwitcher.fadeOut();
  App.startActivitySession();
};
