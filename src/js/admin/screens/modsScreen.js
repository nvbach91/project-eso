const createTable = () => $(`
  <table class="table">
    <thead>
      <tr class="table-header search-result">
        <th class="sr-img">${App.lang.form_image}</th>
        <th class="sr-number">${App.lang.form_number}</th>
        <th class="sr-position">${App.lang.form_position}</th>
        <th class="sr-name">${App.lang.form_name}</th>
        <th class="sr-price">${App.lang.form_price}</th>
        <th class="sr-type">${App.lang.form_type}</th>
        <th class="sr-limit">${App.lang.form_limit}</th>
        <th class="sr-active">${App.lang.form_active}</th>
        <th class="sr-edit">${App.lang.misc_edit}</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
`);

App.renderModsScreen = () => {
  const keys = Object.keys(App.mods);
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_modifications}</div>
      <div class="d-flex justify-content-flex-end">
        <div class="cp-control">${keys.length}&nbsp;${App.getIcon('storage')}</div>
        <button class="btn btn-primary">${App.getIcon('import_export')}&nbsp;Import/Export</button>
      </div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
    <div class="card-body">
      <div class="card-header">
        <div class="card-text">${App.lang.tip_modifications_settings}</div>
        <form class="search-form">
          <div class="input-group">
            <input class="form-control" placeholder="${App.lang.tip_enter_modification_number}" title="Key 1-20 digits" required>
            <button class="btn btn-primary btn-raised">${App.getIcon('search')}&nbsp;${App.lang.misc_search} / ${App.lang.misc_create}</button>
          </div>
        </form>
      </div>
      <table class="table"></table>
    </div>
  `);
  const form = cpBody.find('.search-form');
  const input = form.find('input');
  
  form.submit((e) => {
    e.preventDefault();
    const number = input.val();
    if (number && !isNaN(number)) {
      showEditForm(number);
    } 
  });

  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
  renderTable();
  setTimeout(() => input.focus(), 100);
};

const renderTable = () => {
  const keys = Object.keys(App.mods);

  const newTable = createTable();
  newTable.find('tbody').append(keys.map((key) => {
    const mod = App.mods[key];
    const { name, type, number, position, img, price, limit, active } = mod || {};
    const item = $(`
      <tr>
        <td class="sr-img"${App.getBackgroundImage(img)}></td>
        <td class="sr-number">${number}</td>
        <td class="sr-position">${position}</td>
        <td class="sr-name">${name}</td>
        <td class="sr-price">${price} ${App.settings.currency.symbol}</td>
        <td class="sr-type">${type}</td>
        <td class="sr-limit">${limit}</td>
        <td class="sr-active" title="${active ? App.lang.misc_yes : App.lang.misc_no}">
          ${active ? App.getIcon('check_circle', '', '#28a745') : App.getIcon('cancel', '', '#dc3545')}
        </td>
        <td class="sr-edit">
          <button class="btn btn-primary">${App.getIcon('edit')}</button>
        </td>
      </tr>
    `);
    item.children('.sr-edit, .sr-name, .sr-img, .sr-number').click(() => {
      showEditForm(number);
    });
    return item;
  }));
  const dataTable = newTable.DataTable({
    paging: false,
    searching: false,
    order: [[2, 'asc']],
    columnDefs: [
      {
        orderable: false,
        targets: [0, 8],
      },
    ],
  });
  App.jControlPanelBody.children('.card-header').siblings().replaceWith($(dataTable.table().container()));
};

const showEditForm = (number) => {
  const item = App.mods[number];
  const { name, type, position, img, eans, price, limit, active } = item || { active: true };
  const imgStyle = App.getBackgroundImage(img);
  const modalTitle = `${item ? 'Edit' : 'Create'} modification - ${number}`;
  const form = $(`
    <form class="mod-item">
      <div class="form-row">
        <div class="img-upload">
          <label class="bmd-label-static">${App.lang.form_image}</label>
          <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
          <input class="hidden" name="img" value="${img || ''}">
          ${App.getCloudinaryUploadTag({ tags: ['mod'] })}
        </div>
        <div class="form-col">
          <div class="form-row">
            ${App.generateFormInput({ name: 'number', value: number, disabled: true, type: 'number', min: 0 })}
            ${App.generateFormInput({ name: 'position', value: isNaN(position) ? 0 : position, type: 'number', min: 0 })}
            ${App.generateFormSelect({ name: 'active', value: active || false, options: App.binarySelectOptions })}
          </div>
          <div class="form-row">
            ${App.generateFormInput({ name: 'name', value: name || '' })}
            ${App.generateFormInput({ name: 'limit', value: limit || 1, type: 'number', min: 0, title: App.lang.tip_modification_limit })}
          </div>
          <div class="form-row">
            <em>${App.lang.tip_modifications_mandatory}</em>
          </div>
          <div class="form-row">
            ${App.generateFormInput({ name: 'type', value: type || '' })}
            ${App.generateFormInput({ name: 'price', value: price || 0, pattern: App.regex.price.regex, title: App.regex.price.desc })}
          </div>
          ${App.generateFormInput({ name: 'eans', value: eans ? Object.keys(eans) : '', optional: true })}
        </div>
      </div>
      <div class="mi-control">
        ${item ? `<button type="button" class="btn btn-danger btn-delete">Delete</button>` : ''}
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
    App.saveMod(App.serializeForm(form), btnSave, renderTable);
  });
  btnDelete.click(() => {
    // must confirm (click delete twice) to delete
    if (!btnDelete.data('ready')) {
      btnDelete.addClass('btn-raised').text('Confirm delete').data('ready', true);
    } else {
      App.deleteMod(number, btnDelete, renderTable);
    }
  });
  App.showInModal(form, modalTitle);
};
