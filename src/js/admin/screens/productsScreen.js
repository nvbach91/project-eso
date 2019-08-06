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
      <div class="d-flex justify-content-flex-end">
        <div class="cp-control">${productKeys.length}&nbsp;${App.getIcon('storage')}</div>
        <button class="btn btn-primary">${App.getIcon('import_export')}&nbsp;Import/Export</button>
      </div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
    <div class="card-body">
      <div class="card-text">Tip: Search for a product by its name or code</div>
      <form id="product-search">
        <div class="input-group">
          <input class="form-control" placeholder="Search by name or code" title="PLU EAN code 1-20 digits" required>
          <button class="btn btn-primary btn-raised">${App.getIcon('search')}&nbsp;Search</button>
        </div>
      </form>
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
      showProductEditForm(searchValue, () => input.keyup());
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
          const item = $(`
            <div class="tr search-result">
              <div class="td sr-img"${App.getBackgroundImage(img)}></div>
              <div class="td sr-ean">${App.highlightMatchedText(ean, searchValue)}</div>
              <div class="td sr-name">${App.highlightMatchedText(name, searchValue)}</div>
              <div class="td sr-price">${price} ${App.settings.currencySymbol}</div>
              <div class="td sr-group">${groupName}</div>
              <div class="td sr-vat">${vat} %</div>
              <button class="td sr-edit btn btn-primary">${App.getIcon('edit')}</button>
            </div>
          `);
          item.children('.sr-edit, .sr-name, .sr-img').click(() => {
            showProductEditForm(ean, () => input.keyup());
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
  setTimeout(() => input.focus(), 100);
};

const showProductEditForm = (ean, cb) => {
  if (!cb) cb = () => {};
  const product = App.products[ean];
  const { name, price, group, img, vat, highlight, order, desc } = product || {};
  const imgStyle = App.getBackgroundImage(img);
  const groupOptions = Object.keys(App.groups).map((group) => {
    return { label: `${group} - ${App.groups[group].name}`, value: group };
  });
  groupOptions.unshift({ label: '', value: '' });
  const vatOptions = App.settings.vatRates.map((rate) => {
    return { label: `${rate} %`, value: rate };
  });
  const form = $(`
    <form class="mod-item">
      <p class="h4 mb-4">${product ? 'Edit' : 'Create'} product - ${ean}</p>
      <div class="form-row">
        <div class="form-col">
          <div class="img-upload">
            <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
            <input class="hidden" name="img" value="${img || ''}">
            ${App.getCloudinaryUploadTag({ tags: ['product'] })}
          </div>
        </div>
        <div class="form-col">
          <div class="form-row">
            ${App.generateFormInput({ label: 'Code', name: 'ean', value: ean || '', disabled: true })}
            ${App.generateFormInput({ label: 'Order', name: 'order', value: order || 0, type: 'number', min: 0, width: 50 })}
            ${App.generateFormSelect({ label: 'Highlight', name: 'highlight', value: highlight || false, options: App.binarySelectOptions })}
          </div>
          ${App.generateFormInput({ label: 'Name', name: 'name', value: name || '' })}
        </div>
      </div>
      <div class="form-row">
        ${App.generateFormInput({ label: 'Price', name: 'price', value: price || '' })}
        ${App.generateFormSelect({ label: 'Group', name: 'group', value: group || '', options: groupOptions, type: 'number' })}
        ${App.generateFormSelect({ label: 'VAT', name: 'vat', value: vat || 0, options: vatOptions, type: 'number' })}
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="desc" class="form-control" rows="4">${desc || ''}</textarea>
      </div>
      <div class="form-btns">
        ${product ? `<button type="button" class="btn btn-danger btn-delete">Delete</button>` : ''}
        <button class="btn btn-primary btn-raised btn-save">Save</button>
      </div>
    </form>
  `);
  App.bindCloudinaryFileUpload(
    form.find('input.cloudinary-fileupload[type=file]'), 
    form.find('input[name=img]'), 
    form.find('.img-holder')
  );
  const btnSave = form.find('.btn-save');
  const btnDelete = form.find('.btn-delete');
  form.find('input, select').change(() => {
    btnSave.removeClass('btn-success btn-fail').text('Save');
  });
  form.submit((e) => {
    e.preventDefault();
    App.saveProduct(App.serializeForm(form), btnSave).always(cb);
  });
  btnDelete.click(() => {
    // must confirm (click delete twice) to delete
    if (!btnDelete.data('ready')) {
      btnDelete.addClass('btn-raised').text('Confirm delete').data('ready', true);
    } else {
      App.deleteProduct(ean, btnDelete).always(cb);
    }
  });
  App.showInModal(form);
};
