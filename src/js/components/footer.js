
const footerText = 'footerText';

App.renderFooter = () => {
  const footer = $(`
    <footer id="footer" class="card text-center">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" href="#">Blazefire Production</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">by Ethereals United &copy; 2019</a>
          </li>
          <li class="nav-item">
            <button id="checkout-button" class="btn btn-primary btn-raised">Checkout</button>
          </li>
        </ul>
      </div>
    </footer>
  `);
  App.jFooter.replaceWith(footer);
  App.jFooter = footer;
};
