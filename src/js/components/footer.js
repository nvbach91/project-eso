
const footerText = 'footerText';

App.renderFooter = () => {
  const footer = $(`
    <footer id="footer" class="card text-center">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item" id="back-button">
            <a class="nav-link active" href="#"><i class="material-icons">arrow_back</i></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#">Blazefire Production</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">2019 &copy; Ethereals United</a>
          </li>
          <li class="nav-item" id="locale-switcher">
            <div class="btn-group dropup">
              ${Object.keys(App.supportedLocales).filter((locale) => locale === App.locale).map((locale) => {
                return `
                  <button class="btn locale-button" data-locale="${locale}" data-toggle="dropdown">
                    <div class="flag locale-${locale}"></div>
                    <span>${App.supportedLocales[locale]}</span>
                  </button>
                `;
              }).join('')}
              <div class="dropdown-menu">
                ${Object.keys(App.supportedLocales).filter((locale) => locale !== App.locale).map((locale) => {
                  return `
                    <button class="btn locale-button" data-locale="${locale}">
                      <div class="flag locale-${locale}"></div>
                      <span>${App.supportedLocales[locale]}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </li>
          <li class="nav-item">
            <button id="checkout-button" class="btn btn-primary btn-raised btn-icon">
              <span>Checkout</span>
              <i class="material-icons">arrow_forward</i>
            </button>
          </li>
        </ul>
      </div>
    </footer>
  `);
  App.jFooter.replaceWith(footer);
  App.jFooter = footer;
  App.jBackButton = footer.find('#back-button');
  App.jCheckoutButton = footer.find('#checkout-button');
  App.jCheckoutButton.click(() => {
    if (Object.keys(App.cart).length) {
      App.showCart();
    }
  });
  App.jLocaleSwitcher = App.jFooter.find('#locale-switcher');
  const menu = App.jLocaleSwitcher.find('.dropdown-menu');
  const dropdown = App.jLocaleSwitcher.children('.dropup');
  App.jLocaleSwitcher.find('.locale-button').click(function () {
    const t = $(this);
    if (t.parent().hasClass('dropdown-menu')) {
      const selectedLocale = t.data('locale');
      App.saveLocalPreference('locale', selectedLocale);
      App.renderHeader();
      App.renderStandbyScreen();
    }
    const currentLocaleButton = dropdown.children('.locale-button').removeAttr('data-toggle');
    menu.prepend(currentLocaleButton);

    t.attr({'data-toggle': 'dropdown'});
    dropdown.prepend(t);
  });
};
