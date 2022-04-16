const tableHeader = () => `
  <div class="tr table-header">
    <div class="td sr-img">${App.lang.form_image}</div>
    <div class="td sr-number">${App.lang.form_ean}</div>
    <div class="td sr-name">${App.lang.form_name}</div>
    <div class="td sr-price">${App.lang.form_price}</div>
    <div class="td sr-group">${App.lang.form_group}</div>
    <div class="td sr-vat">${App.lang.form_vat}</div>
    <div class="td sr-edit">${App.lang.misc_edit}</div>
  </div>
`;

App.renderProductsScreen = () => {
  const productKeys = Object.keys(App.products);
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_products}</div>
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
      <div class="card-header">
        <div class="card-text">${App.lang.tip_products_settings}</div>
        <form class="search-form">
          <div class="input-group">
            <input class="form-control" placeholder="${App.lang.tip_search_by_name_or_code}" title="PLU EAN code 1-20 digits" required>
            <button class="btn btn-primary btn-raised">${App.getIcon('search')}&nbsp;${App.lang.misc_search}</button>
          </div>
        </form>
      </div>
      <div class="table"></div>
    </div>
  `);
  const maxSearchResults = 100;
  let searchResults = [];
  const form = cpBody.find('.search-form');
  const input = form.find('input');
  const searchResultsContainer = cpBody.find('.table');
  form.submit((e) => {
    e.preventDefault();
    const searchValue = input.val();
    if (/^[A-Z\d]+$/.test(searchValue)) {
      showEditForm(searchValue, () => input.keyup());
    }
  });
  input.keyup(App.debounce(() => {
    searchResultsContainer.empty();
    const searchValue = input.val();
    // if (searchValue.trim()) {
    const productKeys = Object.keys(App.products);
    for (let i = 0; i < productKeys.length; i++) {
      const ean = productKeys[i];
      const { name, price, group, vat, img } = App.products[ean];
      if (!searchValue || name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 || ean.indexOf(searchValue) >= 0) {
        const groupName = App.groups[group] ? App.groups[group].name : '';
        const item = $(`
            <div class="tr">
              <div class="td sr-img"${App.getBackgroundImage(img)}></div>
              <div class="td sr-number">${App.highlightMatchedText(ean, searchValue)}</div>
              <div class="td sr-name">${App.highlightMatchedText(name, searchValue)}</div>
              <div class="td sr-price">${price} ${App.settings.currency.symbol}</div>
              <div class="td sr-group${groupName ? '' : ' text-danger'}">${group} - ${groupName ? groupName : 'N/A'}</div>
              <div class="td sr-vat">${vat} %</div>
              <button class="td sr-edit btn btn-primary">${App.getIcon('edit')}</button>
            </div>
          `);
        item.children('.sr-edit, .sr-name, .sr-img, .sr-number').click(() => {
          showEditForm(ean, () => input.keyup());
        });
        searchResults.push(item);
        if (searchResults.length >= maxSearchResults) {
          break;
        }
      }
    }
    if (searchResults.length) {
      searchResultsContainer.append(tableHeader());
      searchResultsContainer.append(searchResults);
    } else {
      searchResultsContainer.append(`<div class="tr">No products found. ${/^\d+$/.test(searchValue) ? `Press Enter to create product <span class="match">${searchValue}</span>.` : ''}</div>`);
    }
    searchResults = [];
    // }
  }, App.debounceTime)).keyup();
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
  setTimeout(() => input.focus(), 100);
};

const showEditForm = (ean, cb) => {
  if (!cb) cb = () => { };
  const product = App.products[ean];
  const { name, price, group, img, vat, highlight, position, desc } = product || {};
  const imgStyle = App.getBackgroundImage(img);
  const groupOptions = Object.keys(App.groups).map((group) => {
    return { label: `${group} - ${App.groups[group].name}`, value: group };
  });
  groupOptions.unshift({ label: '', value: '' });
  const vatOptions = App.settings.vatRates.map((rate) => {
    return { label: `${rate} %`, value: rate };
  });
  const modalTitle = `${product ? 'Edit' : 'Create'} product - ${ean}`;
  const form = $(`
    <form class="mod-item">
      <div class="form-row">
        <div class="img-upload">
          <label class="bmd-label-static">${App.lang.form_image}</label>
          <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
          <input class="hidden" name="img" value="${img || ''}">
          ${App.getCloudinaryUploadTag({ tags: ['product'] })}
        </div>
        <div class="form-col">
          <div class="form-row">
            ${App.generateFormInput({ name: 'ean', value: ean || '', disabled: true })}
            ${App.generateFormInput({ name: 'position', value: isNaN(position) ? 0 : position, type: 'number', min: 0, width: 50 })}
            ${App.generateFormSelect({ name: 'highlight', value: highlight || false, options: App.binarySelectOptions })}
          </div>
          ${App.generateFormInput({ name: 'name', value: name || '' })}
        </div>
      </div>
      <div class="form-row">
        ${App.generateFormInput({ name: 'price', value: price || '' })}
        ${App.generateFormSelect({ name: 'group', value: group === undefined ? '' : group.toString(), options: groupOptions, type: 'number' })}
        ${App.generateFormSelect({ name: 'vat', value: vat || 0, options: vatOptions, type: 'number' })}
      </div>
        ${Object.keys(App.modTypes).map((type) => {
          return (`
            <div class="form-row product-mods">
              <label class="bmd-label-static">Mods - ${type}</label>
              <div class="horizontal-scroll">
                ${Object.keys(App.mods).filter((modNumber) => {
                  return App.modTypes[type].includes(Number(modNumber));
                }).map((modNumber) => {
                  const active = !!App.productMods[ean] && App.productMods[ean].includes(Number(modNumber));
                  const mod = App.mods[modNumber];
                  return (`
                    <button title="${mod.price} ${App.settings.currency.symbol}" type="button" class="product-mod btn-toggle btn${active ? ' btn-raised' : ''} btn-${active ? 'primary' : 'secondary'}" data-active="${active.toString()}" data-number="${modNumber}">
                      ${modNumber} - ${mod.name} ${active ? App.getIcon('done', 14) : ''}
                    </button>
                  `);
                }).join('')}
              </div>
            </div>
          `)
        }).join('')}
      <div class="form-group">
        <label>Description</label>
        <textarea name="desc" class="form-control" rows="6">${desc || ''}</textarea>
      </div>
      <div class="mi-control">
        ${product ? `<button type="button" class="btn btn-danger btn-delete">Delete</button>` : ''}
        <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
      </div>
    </form>
  `);
  App.bindCloudinaryFileUpload(
    form.find('input.cloudinary-fileupload[type=file]'),
    form.find('input[name="img"]'),
    form.find('.img-holder')
  );
  const btnSave = form.find('.btn-save');
  const btnDelete = form.find('.btn-delete');
  form.find('input, select').change(() => {
    btnSave.removeClass('btn-success btn-fail').text('Save');
  });
  form.submit((e) => {
    e.preventDefault();
    const data = App.serializeForm(form);
    const mods = [];
    form.find('.product-mod').filter(function () {
      return $(this).data('active');
    }).each(function () {
      mods.push($(this).data('number'));
    });
    data.mods = mods;
    App.saveProduct(data, btnSave).always(cb);
  });
  btnDelete.click(() => {
    // must confirm (click delete twice) to delete
    if (!btnDelete.data('ready')) {
      btnDelete.addClass('btn-raised').text('Confirm delete').data('ready', true);
    } else {
      App.deleteProduct(ean, btnDelete).always(cb);
    }
  });
  form.find('.horizontal-scroll').mousewheel(function (event, delta) {
    this.scrollLeft -= (delta * 30);
    event.preventDefault();
  });
  const sortProductMods = (container) => {
    container.children().detach().sort((a, b) => {
      if ($(a).data('active')) {
        return -1;
      }
      return 1;
    }).appendTo(container);
  };
  App.bindToggleButtons(form, '.product-mod');
  form.find('.product-mods .horizontal-scroll').each(function () {
    sortProductMods($(this));
  });
  App.showInModal(form, modalTitle);
};
