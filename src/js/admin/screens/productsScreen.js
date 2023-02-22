const createTable = () => $(`
  <table class="table">
    <thead>
      <tr class="table-header search-result">
        <th class="sr-img">${App.lang.form_image}</th>
        <th class="sr-number">${App.lang.form_ean}</th>
        <th class="sr-name">${App.lang.form_name}</th>
        <th class="sr-price">${App.lang.form_price}</th>
        <th class="sr-group">${App.lang.form_group}</th>
        <th class="sr-vat">${App.lang.form_vat}</th>
        <th class="sr-active">${App.lang.form_active}</th>
        <th class="sr-available">${App.lang.form_available}</th>
        <th class="sr-edit">${App.lang.misc_edit}</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
`);

App.createGroupFilter = () => {
  const groupNumbers = Object.keys(App.groups);
  const options = groupNumbers.map((groupNumber) => {
    const nProducts = Object.keys(App.products).filter((key) => App.products[key].group.toString() === groupNumber).length;
    return `<option value="${groupNumber}">${groupNumber} - ${App.groups[groupNumber].name} (${nProducts})</option>`;
  }).join('');
  return (`
    <select class="custom-select custom-select-lg" name="group">
      <option value="">All groups</option>
      ${options}
    </select>
  `);
};

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
            ${App.createGroupFilter()}
            <button class="btn btn-primary btn-raised">${App.getIcon('search')}&nbsp;${App.lang.misc_search} / ${App.lang.misc_create}</button>
          </div>
        </form>
      </div>
    </div>
  `);
  const maxSearchResults = 100;
  const form = cpBody.find('.search-form');
  const input = form.find('input');
  form.submit((e) => {
    e.preventDefault();
    const searchValue = input.val();
    if (App.regex.ean.regex.test(searchValue)) {
      showEditForm(searchValue, groupFilterValue, () => input.keyup());
    }
  });
  let table = createTable();
  cpBody.append(table);
  input.keyup(App.debounce(() => {
    const searchResults = [];
    const inputValue = input.val();
    const searchValue = App.removeDiacritics(inputValue).toLowerCase();
    // if (searchValue.trim()) {
    const productKeys = !groupFilterValue ? Object.keys(App.products) : Object.keys(App.products).filter((ean) => {
      return App.products[ean].group.toString() === groupFilterValue;
    });
    for (let i = 0; i < productKeys.length; i++) {
      const ean = productKeys[i];
      const { name, price, group, vat, img, active, available } = App.products[ean];
      if (!searchValue || App.removeDiacritics(name).toLowerCase().indexOf(searchValue) >= 0 || ean.toLowerCase().indexOf(searchValue) >= 0) {
        const groupName = App.groups[group] ? App.groups[group].name : '';
        const item = $(`
          <tr>
            <td class="sr-img"${App.getBackgroundImage(img)}></td>
            <td class="sr-number">${App.highlightMatchedText(ean, inputValue)}</td>
            <td class="sr-name">${App.highlightMatchedText(name, inputValue)}</td>
            <td class="sr-price">${price} ${App.settings.currency.symbol}</td>
            <td class="sr-group${groupName ? '' : ' text-danger'}">${group} - ${groupName ? groupName : 'N/A'}</td>
            <td class="sr-vat">${vat} %</td>
            <td class="sr-active" title="${active ? App.lang.misc_yes : App.lang.misc_no}">${active ? App.getIcon('check_circle', '', '#28a745') : App.getIcon('cancel', '', '#dc3545')}</td>
            <td class="sr-available" title="${available ? App.lang.misc_yes : App.lang.misc_no}">${available ? App.getIcon('check_circle', '', '#28a745') : App.getIcon('cancel', '', '#dc3545')}</td>
            <td class="sr-edit">
              <button class="btn btn-primary">${App.getIcon('edit')}</button>
            </td>
          </tr>
        `);
        item.children('.sr-edit, .sr-name, .sr-img, .sr-number').click(() => {
          showEditForm(ean, group, () => input.keyup());
        });
        searchResults.push(item);
        if (searchResults.length >= maxSearchResults) {
          break;
        }
      }
    }
    if (!searchResults.length) {
      const noResultsButton = $(`
        <button class="btn">
            No products found. ${App.regex.ean.regex.test(inputValue) ? `Press Enter to create product with this code <span class="match">${inputValue}</span>.` : ''}
        </button>
      `);
      table.replaceWith(noResultsButton);
      table = noResultsButton;
    } else {
      const newTable = createTable();
      newTable.find('tbody').append(searchResults);
      const dataTable = newTable.DataTable({
        paging: false,
        searching: false,
        order: [[4, 'asc']],
        columnDefs: [
          {
            orderable: false,
            targets: [0, 8],
          },
        ],
      });
      const t = $(dataTable.table().container());
      table.replaceWith(t);
      table = t;
    }
  }, App.debounceTime)).keyup();
  let groupFilterValue = '';
  cpBody.find('select[name="group"]').change((e) => {
    groupFilterValue = e.target.value;
    input.keyup();
  });
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
  setTimeout(() => input.focus(), 100);
};

const showEditForm = (ean, groupValue, cb) => {
  if (!cb) cb = () => { };
  const product = App.products[ean];
  const { name, price, group, img, vat, highlight, position, desc, active, available, promotion } = product || { active: true, available: true };
  const imgStyle = App.getBackgroundImage(img);
  const groupOptions = Object.keys(App.groups).map((gn) => {
    return { label: `${gn} - ${App.groups[gn].name}`, value: gn };
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
            ${App.generateFormInput({ name: 'promotion', value: promotion || '', optional: true })}
          </div>
          <div class="form-row">
            ${App.generateFormInput({ name: 'name', value: name || '' })}
            ${App.generateFormSelect({ name: 'active', value: active || false, options: App.binarySelectOptions })}
            ${App.generateFormSelect({ name: 'available', value: available || false, options: App.binarySelectOptions })}
          </div>
        </div>
      </div>
      <div class="form-row">
        ${App.generateFormInput({ name: 'price', value: price || '', pattern: App.regex.price.regex, title: App.regex.price.desc })}
        ${App.generateFormSelect({ name: 'group', value: (group !== undefined ? group : groupValue).toString(), options: groupOptions, type: 'number' })}
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
        <label>${App.lang.form_description}</label>
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
