App.renderHeader = () => {
  const header = $(`
    <header id="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#">
          <img src="${App.imageUrlBase}${App.settings.img || 'favicon_zuuuf9.png'}" width="30" height="30" class="d-inline-block align-top" alt="">
          <span>${App.settings.name}</span>
        </a>
        <ul id="delivery-method" class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="#">
              <span></span>&nbsp;
              ${App.getIcon('book')}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `);
  App.jDeliveryMethodIndicator = header.find('#delivery-method');
  App.jHeader.replaceWith(header);
  App.jHeader = header;
};
