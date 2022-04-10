App.renderTableMarkerScreen = () => {
  // App.jOrderPreview.remove();
  const keyboardKeys = [
    7,  8,  9,
    4,  5,  6,
    1,  2,  3,
   'd', 0, 'o',
  ];
  const keyboardMasks = {
    'd': '⇦',
    'o': 'OK',
  };
  const screen = $(`
    <main id="main">
      <div class="screen table-markers">
        <div class="card full-width-card">
          <h5 class="card-header">${App.lang.table_markers_title}</h5>
        </div>
        <br>
        <div class="selection">
          <div class="card keyboard">
            ${keyboardKeys.map((key) => {
              return (`
                <button class="btn btn-primary${key === 'o' ? ' btn-raised' : ''}"${key === 'o' ? ' disabled' : ''} data-key="${key}">
                  ${keyboardMasks[key] ? keyboardMasks[key] : key}
                </button>
              `)
            }).join('')}
          </div>
          <div class="card table-marker"${App.getBackgroundImage(App.settings.tableMarkers.img)}">
            <button class="btn btn-raised btn-danger" id="skip-table-marker">${App.lang.misc_skip}</button>
            <div class="table-marker-text">${App.tableMarkerValue || ''}</div>
          </div>
        </div>
        <br>
        <div class="card full-width-card">
          <h5 class="card-header">${App.lang.checkout_return_title}</h5>
          <div class="card-body">
            <button class="btn btn-warning go-back btn-icon">
              ${App.getIcon('arrow_back')}
              <span>${App.lang.checkout_return_btn}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  `);
  // const tableMarker = screen.find('.table-marker');
  const tableMarkerText = screen.find('.table-marker-text');
  const skipButton = screen.find('#skip-table-marker').click(() => {
    App.renderCheckoutScreen();
  });
  screen.find('.keyboard button').click(function () {
    const key = $(this).data('key');
    if (key === '') {
      return false;
    }
    const existingValue = tableMarkerText.text();
    if (key === 'o') {
      App.tableMarkerValue = existingValue;
      return App.renderCheckoutScreen();
    }
    let newValue;
    if (key === 'd') {
      newValue = existingValue.slice(0, -1);
      screen.find('.keyboard button[data-key="o"]').prop('disabled', !newValue);
      tableMarkerText.text(newValue);
      if (!newValue) {
        skipButton.show();
      }
      return true;
    }
    if (existingValue.length < 1 && key === 0) {
      return false;
    }
    if (existingValue.length === 3) {
      if (key === 0) {
        newValue = '';
      } else {
        newValue = key;
      }
    } else {
      newValue = `${existingValue}${key}`;
    }
    screen.find('.keyboard button[data-key="o"]').prop('disabled', !newValue);
    if (!newValue) {
      skipButton.show();
    } else {
      skipButton.hide();
    }
    tableMarkerText.text(newValue);
    return true;
  });
  screen.find('.go-back').click(() => {
    App.renderOrderScreen();
    App.showCart();
  });
  screen.find('.card').hide();
  App.jBackButton.fadeOut();
  App.jCheckoutButton.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  screen.find('.card').slideDown(App.getAnimationTime());
};
