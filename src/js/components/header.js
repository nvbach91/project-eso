
const img = 'https://amp.businessinsider.com/images/53a9d02becad04fd3af8649a-640-480.jpg';
//<h1 class="display-2">${App.settings.name}<h1>
App.renderHeader = () => {
  const header = $(`
    <header id="header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">
          <img src="https://www.shareicon.net/download/2016/09/23/833952_food.svg" width="30" height="30" class="d-inline-block align-top" alt="">
          The Elusive Camel
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Features</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Pricing</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  `);
  App.jHeader.replaceWith(header);
  App.jHeader = header;
};
