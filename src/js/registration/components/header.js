App.renderHeader = (localeSwitcher) => {
  const header = $(`
    <header id="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#">
          <img src="${App.imageUrlBase}${App.settings.img || 'favicon_zuuuf9.png'}" width="30" height="30" class="d-inline-block align-top" alt="">
          <span>iTake Registration</span>
        </a>
        <div id="locale-switcher"></div>
      </nav>
    </header>
  `);
  if (localeSwitcher) {
    header.find('#locale-switcher').replaceWith(localeSwitcher.find('.btn-group'));
  }
  App.jHeader.replaceWith(header);
  App.jHeader = header;
};
