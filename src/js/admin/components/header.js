App.renderHeader = () => {
  const header = $(`
    <header id="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#">
          <img src="https://www.shareicon.net/download/2016/09/23/833952_food.svg" width="30" height="30" class="d-inline-block align-top" alt="">
          <span>The Elusive Camel</span>
        </a>
      </nav>
    </header>
  `);
  App.jHeader.replaceWith(header);
  App.jHeader = header;
};
