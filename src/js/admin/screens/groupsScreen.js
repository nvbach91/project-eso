const createTable = () => $(`
  <table class="table">
    <thead>
      <tr class="table-header search-result">
        <th class="sr-img">${App.lang.form_image}</th>
        <th class="sr-number">${App.lang.form_number}</th>
        <th class="sr-position">${App.lang.form_position}</th>
        <th class="sr-name">${App.lang.form_name}</th>
        <th class="sr-display">${App.lang.form_display}</th>
        <th class="sr-products">${App.lang.misc_products}</th>
        <th class="sr-edit">${App.lang.misc_edit}</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
`);

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
  const keys = Object.keys(App.groups);

  const newTable = createTable();
  newTable.find('tbody').append(keys.map((key) => {
    const group = App.groups[key];
    const { name, number, position, img, display } = group || {};
    const nProducts = App.getNumberOfProductsInGroup(number);
    const item = $(`
      <tr>
        <td class="sr-img"${App.getBackgroundImage(img)}></td>
        <td class="sr-number">${number}</td>
        <td class="sr-position">${position}</td>
        <td class="sr-name">${name}</td>
        <td class="sr-display" title="${display ? App.lang.misc_yes : App.lang.misc_no}">
          ${display ? App.getIcon('check_circle', '', '#28a745') : App.getIcon('cancel', '', '#dc3545')}
        </td>
        <td class="sr-products">${nProducts}</td>
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
        targets: [0, 6],
      },
    ],
  });
  App.jControlPanelBody.children('.card-header').siblings().replaceWith($(dataTable.table().container()));
};

const showEditForm = (number) => {
  const item = App.groups[number];
  const { name, position, img, display, description } = item || {};
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
            ${App.generateFormSelect({ name: 'display', value: display, options: App.binarySelectOptions, width: 80 })}
          </div>
          <div class="form-row">
            ${App.generateFormInput({ name: 'description', value: description || '', optional: true })}
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
        <table class="table">
          <thead>
            <tr class="table-header search-result">
              <th class="sr-position">${App.lang.form_position}</th>
              <th class="sr-ean">${App.lang.form_ean}</th>
              <th class="sr-name">${App.lang.form_name}</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(App.products).filter((ean) => {
              return number == App.products[ean].group;
            }).sort((a, b) => App.products[a].position - App.products[b].position).map((ean) => {
              const { name, position } = App.products[ean];
              return (`
                <tr>
                  <td class="sr-position">${position || 0}</td>
                  <td class="sr-number">${ean}</td>
                  <td class="sr-name">${name}</td>
                </tr>
              `);
            }).join('')}
          <tbody>
        </table>
      `);
    }
    // must confirm (click delete twice) to delete
    if (!btnDelete.data('ready')) {
      btnDelete.addClass('btn-raised').text('Confirm delete').data('ready', true);
    } else {
      App.deleteGroup(number, btnDelete).done(renderTable);
    }
  });
  App.showInModal(form, modalTitle);
};
