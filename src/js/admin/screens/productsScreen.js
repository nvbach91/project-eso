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
        <form id="product-search">
          <div class="input-group">
            <input class="form-control" placeholder="Search by name or code" title="PLU EAN code 1-20 digits" required>
            <button class="btn btn-primary btn-raised"><i class="material-icons">search</i>&nbsp;Search</button>
          </div>
        </form>
      </div>
      <div id="search-results" class="table"></div>
    </div>
  `);
  const maxSearchResults = 20;
  let searchResults = [];
  const form = cpBody.find('#product-search');
  const input = form.find('input');
  const searchResultsContainer = cpBody.find('#search-results');
  form.submit((e) => {
    e.preventDefault();
    const searchValue = input.val();
    if (/^\d+$/.test(searchValue)) {
      App.showProductEditForm(searchValue);
    }
  });
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
          const item = $(`
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
          item.children('.sr-edit, .sr-name').click(() => {
            App.showProductEditForm(ean, () => input.keyup());
          });
          searchResults.push(item);
          if (searchResults.length >= maxSearchResults) {
            break;
          }
        }
      }
      if (searchResults.length) {
        searchResultsContainer.append(tableHeader);
        searchResultsContainer.append(searchResults);
      } else {
        searchResultsContainer.append(`<div class="tr">No products found. ${/^\d+$/.test(searchValue) ? `Press Enter to create product <span class="match">${searchValue}</span>.` : ''}</div>`);
      }
      searchResults = [];
    }
  }, App.debounceTime));
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};
App.generateGroupSelect = (selected) => {
  return `
    <div class="form-group">
      <label>Group</label>
      <select class="custom-select" name="group" required>
        <option></option>
        ${Object.keys(App.groups).map((group) => {
          const { name } = App.groups[group];
          return `<option value="${group}"${selected == group ? ' selected' : ''}>${group} - ${name}</option>`;
        }).join('')}
      </select>
    </div>
  `;
};
App.generateVatRateSelect = (selected) => {
  return `
    <div class="form-group">
      <label>VAT</label>
      <select class="custom-select" name="vat" required>
        ${App.settings.vatRates.map((rate) => {
          return `<option value="${rate}"${selected == rate ? ' selected' : ''}>${rate} %</option>`;
        }).join('')}
      </select>
    </div>
  `;
};
App.showProductEditForm = (ean, cb) => {
  if (!cb) cb = () => {};
  const product = App.products[ean];
  const { name, price, group, img, vat } = product || {};
  const style = img ? ` style="background-image: url(${App.imageUrlBase}${img})"` : '';
  const form = $(`
    <form>
      <p class="h4 mb-4">${product ? 'Edit' : 'Create'} product - ${ean}</p>
      <div class="form-row">
        <div class="form-col">
          <div class="img-upload">
            <div class="btn img-holder"${style}>${style ? '' : '<i class="material-icons">image</i>'}</div>
            <input type="hidden" name="img" value="${img}">
          </div>
        </div>
        <div class="form-col">
          ${App.generateFormInput({ label: 'Code', name: 'ean', value: ean || '', disabled: true })}
          ${App.generateFormInput({ label: 'Name', name: 'name', value: name || '', required: true })}
        </div>
      </div>
      <div class="form-row">
        ${App.generateFormInput({ label: 'Price', name: 'price', value: price || '', required: true })}
        ${App.generateGroupSelect(group || '')}
        ${App.generateVatRateSelect(vat || 0)}
      </div>
      <div class="form-btns">
        ${product ? `<button type="button" class="btn btn-danger btn-delete">Delete</button>` : ''}
        <button class="btn btn-primary btn-raised btn-save">Save</button>
      </div>
    </form>
  `);
  form.submit((e) => {
    e.preventDefault();
    const btn = form.find('.btn-save').text('Saving');
    App.saveProduct({
      ean: form.find('[name="ean"]').val(),
      name: form.find('[name="name"]').val(),
      group: parseInt(form.find('[name="group"]').val()),
      price: form.find('[name="price"]').val(),
      vat: parseInt(form.find('[name="vat"]').val()),
      img: form.find('[name="img"]').val(),
    }).done(() => {
      btn.text('Saved').addClass('btn-success');
    }).fail(() => {
      btn.text('Failed to save').addClass('btn-danger');
    }).always(cb);
  });
  form.find('.btn-delete').click(() => {
    const btn = form.find('.btn-delete');
    if (!btn.attr('data-ready')) {
      btn.text('Confirm delete').attr('data-ready', true);
    } else {
      btn.text('Deleting').removeAttr('data-ready');
      App.deleteProduct(ean).done(() => {
        btn.text('Deleted').addClass('btn-success');
        App.closeModal();
      }).fail(() => {
        btn.text('Failed to delete').addClass('btn-danger');
      }).always(cb);
    }
  });
  App.showInModal(form);
};