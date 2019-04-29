const App = {};
window.App = App;

require('./utils');
require('./components/header');
require('./components/main');
require('./components/footer');

App.renderSkeleton = () => {
  const dom = `
    <header id="header"></header>
    <main id="main">
      <div id="tabs"></div>
      <div id="products"></div>
    </main>
    <footer id="footer"></footer>
  `;
  App.jContainer.html(dom);
};

App.connect = () => {
  App.settings = { name: 'Spread Eagle' };
  App.categories = {
    '0': { name: 'Category', img: 'bg09_hjz6no' },
    '1': { name: 'Category', img: 'bg10_coyfml' },
    '2': { name: 'Category', img: 'bg07_wrsdxe' },
    '3': { name: 'Category', img: 'bg04_i3fq68' },
    '4': { name: 'Category', img: 'bg06_gmmeqj' },
    '5': { name: 'Category', img: 'bg01_mog1lh' },
    '6': { name: 'Category', img: 'bg05_osoyo0' },
    '7': { name: 'Category', img: 'bg02_komziq' },
    '8': { name: 'Category', img: 'bg03_tdlabn' },
    '9': { name: 'Category', img: 'bg08_hsajsa' },
  };
  App.products = {
    '0': { name: 'Product', price: '42.00', img: 'bg09_hjz6no', category: '2' },
    '1': { name: 'Product', price: '42.00', img: 'bg10_coyfml', category: '2' },
    '2': { name: 'Product', price: '12.00', img: 'bg07_wrsdxe', category: '7' },
    '3': { name: 'Product', price: '72.00', img: 'bg04_i3fq68', category: '4' },
    '4': { name: 'Product', price: '56.00', img: 'bg06_gmmeqj', category: '3' },
    '5': { name: 'Product', price: '71.00', img: 'bg01_mog1lh', category: '2' },
    '6': { name: 'Product', price: '81.00', img: 'bg05_osoyo0', category: '0' },
    '7': { name: 'Product', price: '62.00', img: 'bg02_komziq', category: '7' },
    '8': { name: 'Product', price: '31.00', img: 'bg03_tdlabn', category: '0' },
    '9': { name: 'Product', price: '19.00', img: 'bg08_hsajsa', category: '8' },
    '00': { name: 'Product', price: '42.00', img: 'bg09_hjz6no', category: '2' },
    '11': { name: 'Product', price: '42.00', img: 'bg10_coyfml', category: '5' },
    '22': { name: 'Product', price: '12.00', img: 'bg07_wrsdxe', category: '2' },
    '33': { name: 'Product', price: '72.00', img: 'bg04_i3fq68', category: '4' },
    '44': { name: 'Product', price: '56.00', img: 'bg06_gmmeqj', category: '3' },
    '55': { name: 'Product', price: '71.00', img: 'bg01_mog1lh', category: '2' },
    '66': { name: 'Product', price: '81.00', img: 'bg05_osoyo0', category: '7' },
    '77': { name: 'Product', price: '62.00', img: 'bg02_komziq', category: '0' },
    '88': { name: 'Product', price: '31.00', img: 'bg03_tdlabn', category: '1' },
    '99': { name: 'Product', price: '19.00', img: 'bg08_hsajsa', category: '0' },
    '000': { name: 'Product', price: '42.00', img: 'bg09_hjz6no', category: '2' },
    '111': { name: 'Product', price: '42.00', img: 'bg10_coyfml', category: '6' },
    '522': { name: 'Product', price: '12.00', img: 'bg07_wrsdxe', category: '8' },
    '633': { name: 'Product', price: '72.00', img: 'bg04_i3fq68', category: '6' },
    '744': { name: 'Product', price: '56.00', img: 'bg06_gmmeqj', category: '3' },
    '855': { name: 'Product', price: '71.00', img: 'bg01_mog1lh', category: '2' },
    '666': { name: 'Product', price: '81.00', img: 'bg05_osoyo0', category: '9' },
    '777': { name: 'Product', price: '62.00', img: 'bg02_komziq', category: '1' },
    '8888': { name: 'Product', price: '31.00', img: 'bg03_tdlabn', category: '1' },
    '9999': { name: 'Product', price: '19.00', img: 'bg08_hsajsa', category: '0' },
    '0000': { name: 'Product', price: '42.00', img: 'bg09_hjz6no', category: '2' },
    '1111': { name: 'Product', price: '42.00', img: 'bg10_coyfml', category: '1' },
    '5222': { name: 'Product', price: '12.00', img: 'bg07_wrsdxe', category: '5' },
    '6333': { name: 'Product', price: '72.00', img: 'bg04_i3fq68', category: '4' },
    '7444': { name: 'Product', price: '56.00', img: 'bg06_gmmeqj', category: '3' },
    '8555': { name: 'Product', price: '71.00', img: 'bg01_mog1lh', category: '7' },
    '6666': { name: 'Product', price: '81.00', img: 'bg05_osoyo0', category: '0' },
    '7777': { name: 'Product', price: '62.00', img: 'bg02_komziq', category: '0' },
    '8888': { name: 'Product', price: '31.00', img: 'bg03_tdlabn', category: '1' },
    '9999': { name: 'Product', price: '19.00', img: 'bg08_hsajsa', category: '0' },
  };
  return $.when();
};

App.render = () => {
  App.renderHeader();
  App.renderMain();
  App.renderFooter();
};

App.init = () => {
  App.jContainer = $('#app');
  App.renderSkeleton();
  App.jHeader = $('#header');
  App.jMain = $('#main');
  App.jTabs = $('#tabs');
  App.jProducts = $('#products');
  App.jFooter = $('#footer');
  App.connect().done(() => {
    App.render();
  });
};
