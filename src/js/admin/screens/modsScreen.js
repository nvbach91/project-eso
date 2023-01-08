const tableHeader = () => `
  <div class="tr table-header">
    <div class="td sr-img">${App.lang.form_image}</div>
    <div class="td sr-number">${App.lang.form_number}</div>
    <div class="td sr-position">${App.lang.form_position}</div>
    <div class="td sr-name">${App.lang.form_name}</div>
    <div class="td sr-price">${App.lang.form_price}</div>
    <div class="td sr-type">${App.lang.form_type}</div>
    <div class="td sr-limit">${App.lang.form_limit}</div>
    <div class="td sr-edit">${App.lang.misc_edit}</div>
  </div>
`;

let table;

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
      <div class="table"></div>
    </div>
  `);
  table = cpBody.find('.table');
  const form = cpBody.find('.search-form');
  const input = form.find('input');
  
  form.submit((e) => {
    e.preventDefault();
    const number = input.val();
    if (number && !isNaN(number)) {
      showEditForm(number);
    } 
  });
  
  renderTable();
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
  setTimeout(() => input.focus(), 100);
};

const renderTable = () => {
  const keys = Object.keys(App.mods);
  keys.sort((a, b) => App.mods[a].position - App.mods[b].position); // Ascending position

  table.empty();
  table.append(tableHeader(), keys.map((key) => {
    const i = App.mods[key];
    const { name, type, number, position, img, price, limit } = i || {};
    const item = $(`
      <div class="tr">
        <div class="td sr-img"${App.getBackgroundImage(img)}></div>
        <div class="td sr-number">${number}</div>
        <div class="td sr-position">${position}</div>
        <div class="td sr-name">${name}</div>
        <div class="td sr-price">${price} ${App.settings.currency.symbol}</div>
        <div class="td sr-type">${type}</div>
        <div class="td sr-limit">${limit}</div>
        <button class="td sr-edit btn btn-primary">${App.getIcon('edit')}</button>
      </div>
    `);
    item.children('.sr-edit, .sr-name, .sr-img, .sr-number').click(() => {
      showEditForm(number);
    });
    return item;
  }));
};

const showEditForm = (number) => {
  const item = App.mods[number];
  const { name, type, position, img, eans, price, limit } = item || {};
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
            ${App.generateFormInput({ name: 'price', value: price || Number(0).formatMoney() })}
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
