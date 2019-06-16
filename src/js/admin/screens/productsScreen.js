const tableHeader = `
  <div class="tr search-result">
    <div class="td sr-img">Image</div>
    <div class="td sr-ean">Code</div>
    <div class="td sr-name">Name</div>
    <div class="td sr-price">Price</div>
    <div class="td sr-group">Group</div>
    <div class="td sr-vat">VAT</div>
    <div class="td sr-edit">Edit</div>
  </div>
`;
App.renderProductsScreen = () => {
  const productKeys = Object.keys(App.products);
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Products</div>
      <div class="cp-control">${productKeys.length}&nbsp;<i class="material-icons">storage</i></div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
    <div>
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Manage your catalog</h5>
        <button class="btn btn-primary"><i class="material-icons">import_export</i>&nbsp;Import/Export</button>
      </div>
      <div class="card-body">
        <p class="card-text">Search for a product by its name or code</p>
        <div class="input-group">
          <input class="form-control" placeholder="Search by name or code" title="PLU EAN code 1-20 digits" id="product-search">
          <button class="btn btn-primary btn-raised"><i class="material-icons">search</i>&nbsp;Search</button>
        </div>
      </div>
      <div id="search-results" class="table"></div>
    </div>
  `);
  const maxSearchResults = 20;
  let searchResults = [];
  const input = cpBody.find('#product-search');
  const searchResultsContainer = cpBody.find('#search-results');

  input.keyup(App.debounce(() => {
    searchResultsContainer.empty();
    const searchValue = input.val();
    if (searchValue.trim()) {
      const productKeys = Object.keys(App.products);
      for (let i = 0; i < productKeys.length; i++) {
        const ean = productKeys[i];
        const { name, price, group, vat, img } = App.products[ean];
        if (name.indexOf(searchValue) >= 0 || ean.indexOf(searchValue) >= 0) {
          const groupName = App.groups[group] ? App.groups[group].name : '';
          const style = ` style="background-image: url(${App.imageUrlBase}${img})"`;
          searchResults.push(`
            <div class="tr search-result">
              <div class="td sr-img" ${style}></div>
              <div class="td sr-ean">${App.highlightMatchedText(ean, searchValue)}</div>
              <div class="td sr-name">${App.highlightMatchedText(name, searchValue)}</div>
              <div class="td sr-price">${price} ${App.settings.currency.symbol}</div>
              <div class="td sr-group">${groupName}</div>
              <div class="td sr-vat">${vat} %</div>
              <button class="td sr-edit btn btn-primary"><i class="material-icons">edit</i></button>
            </div>
          `);
          if (searchResults.length >= maxSearchResults) {
            break;
          }
        }
      }
      if (searchResults.length) {
        searchResultsContainer.append(tableHeader + searchResults.join(''));
      } else {
        searchResultsContainer.append(`<div>No products found</div>`)
      }
      searchResults = [];
    }
  }, App.debounceTime));
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};