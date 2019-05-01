App.renderDiningChoiceScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="dining-choices">
        <div class="card full-width-card">
          <h5 class="card-header">Welcome!</h5>
          <div class="card-body">
            <h5 class="card-title">Special on-the-house treatment</h5>
            <p class="card-text">Order 5 get 1 free</p>
            <a href="#" class="btn btn-primary">Let's do it!</a>
          </div>
        </div>
        <br>
        <div class="selection">
          <div class="card" data-method="eat-in">
            <div class="btn card-img-top" style="background-image: url(https://media1.s-nbcnews.com/j/streams/2014/October/141006/2D274906938828-today-cafeteria-140811-01.fit-760w.jpg)"></div>
            <div class="card-body">
              <h5 class="card-title">Eat in</h5>
              <p class="card-text">Let's enjoy the atmosphere in our restaurant</p>
              <button class="btn btn-primary btn-raised">I'll eat here</button>
            </div>
          </div>
          <div class="card" data-method="take-out">
            <div class="btn card-img-top" style="background-image: url(https://www.sld.com/wp-content/uploads/2017/03/1280x480RestaurantTakeOut.jpg)"></div>
            <div class="card-body">
              <h5 class="card-title">Take out</h5>
              <p class="card-text">I want to pack my meal</p>
              <button class="btn btn-primary btn-danger btn-raised">I'll take it home</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `);
  screen.find('.selection .card').click(function () {
    App.isTakeOut = $(this).data('method') === 'take-out';
    App.renderOrderScreen();
  });
  screen.hide();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn();
};
