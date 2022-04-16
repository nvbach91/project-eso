const tableHeader = () => `
  <div class="tr table-header">
    <div class="td sr-img">${App.lang.form_image}</div>
    <div class="td sr-number">${App.lang.form_number}</div>
    <div class="td sr-position">${App.lang.form_position}</div>
    <div class="td sr-name">${App.lang.form_name}</div>
    <div class="td sr-display">${App.lang.form_display}</div>
    <div class="td sr-products">${App.lang.misc_products}</div>
    <div class="td sr-edit">${App.lang.misc_edit}</div>
  </div>
`;

let table;

App.renderGroupsScreen = () => {
  const keys = Object.keys(App.groups);
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_groups}</div>
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
        <div class="card-text">${App.lang.tip_groups_settings}</div>
        <form class="search-form">
          <div class="input-group">
            <input class="form-control" placeholder="${App.lang.tip_enter_group_number}" title="Key 1-20 digits" required>
            <button class="btn btn-primary btn-raised">${App.getIcon('search')}&nbsp;${App.lang.misc_search}</button>
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
  const keys = Object.keys(App.groups);
  keys.sort((a, b) => App.groups[a].position - App.groups[b].position); // Ascending position

  table.empty();
  table.append(tableHeader(), keys.map((key) => {
    const i = App.groups[key];
    const { name, number, position, img, display } = i || {};
    const nProducts = App.getNumberOfProductsInGroup(number);
    const item = $(`
      <div class="tr">
        <div class="td sr-img"${App.getBackgroundImage(img)}></div>
        <div class="td sr-number">${number}</div>
        <div class="td sr-position">${position}</div>
        <div class="td sr-name">${name}</div>
        <div class="td sr-display">${display ? 'Yes' : 'No'}</div>
        <div class="td sr-products">${nProducts}</div>
        <button class="td sr-edit btn btn-primary">${App.getIcon('edit')}</button>
      </div>
    `);
    item.children('.sr-edit, .sr-name, .sr-img, .sr-number').click(() => showEditForm(number));
    return item;
  }));
};

const showEditForm = (number) => {
  const item = App.groups[number];
  const { name, position, img, display } = item || {};
  const imgStyle = App.getBackgroundImage(img);
  const modalTitle = `${item ? 'Edit' : 'Create'} group - ${number}`;
  const form = $(`
    <form class="mod-item">
      <div class="form-row">
        <div class="img-upload">
          <label class="bmd-label-static">${App.lang.form_image}</label>
          <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
          <input class="hidden" name="img" value="${img || ''}">
          ${App.getCloudinaryUploadTag({ tags: ['group'] })}
        </div>
        <div class="form-col">
          <div class="form-row">
            ${App.generateFormInput({ name: 'number', value: number, disabled: true, type: 'number', min: 0 })}
            ${App.generateFormInput({ name: 'position', value: isNaN(position) ? 0 : position, type: 'number', min: 0 })}
          </div>
          <div class="form-row">
            ${App.generateFormInput({ name: 'name', value: name || '' })}
            ${App.generateFormSelect({ name: 'display', value: display || true, options: App.binarySelectOptions, width: 80 })}
          </div>
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
    App.saveGroup(App.serializeForm(form), btnSave).done(renderTable);
  });
  btnDelete.click(() => {
    const nProductsInGroup = App.getNumberOfProductsInGroup(number);
    if (nProductsInGroup) {
      return App.showWarning(`
        <div>You must delete all products (${nProductsInGroup}) of this group first</div>
        <div class="table">
          <div class="tr table-header">
            <div class="td sr-position">${App.lang.form_position}</div>
            <div class="td sr-ean">${App.lang.form_ean}</div>
            <div class="td sr-name">${App.lang.form_name}</div>
          </div>
          ${Object.keys(App.products).filter((ean) => {
            return number == App.products[ean].group;
          }).sort((a, b) => App.products[a].position - App.products[b].position).map((ean) => {
            const { name, position } = App.products[ean];
            return `
              <div class="tr">
                <div class="td sr-position">${position || 0}</div>
                <div class="td sr-number">${ean}</div>
                <div class="td sr-name">${name}</div>
              </div>
            `;
          }).join('')}
        </div>
      `);
    }
    // must confirm (click delete twice) to delete
    if (!btnDelete.data('ready')) {
      btnDelete.addClass('btn-raised').text('Confirm delete').data('ready', true);
    } else {
      App.deleteGroup(number, btnDelete);
    }
  });
  App.showInModal(form, modalTitle);
};
