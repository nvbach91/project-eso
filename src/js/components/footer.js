
const footerText = 'footerText';

App.renderFooter = () => {
  const footer = $(`
  <div class="card text-center">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item">
          <a class="nav-link active" href="#">Active</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
      </ul>
    </div>
  </div>
  `);
  App.jFooter.replaceWith(footer);
  App.jFooter = footer;
};
