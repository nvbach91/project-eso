const tableHeader = `
  <div class="tr table-header">
    <div class="td sr-img">Image</div>
    <div class="td sr-number">Number</div>
    <div class="td sr-order">Order</div>
    <div class="td sr-name">Name</div>
    <div class="td sr-price">Price</div>
    <div class="td sr-type">Type</div>
    <div class="td sr-edit">Edit</div>
  </div>
`;

let table;

App.renderModsScreen = () => {
  const keys = Object.keys(App.mods);
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Modifications</div>
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
      <div class="card-text">Tip: Add or edit modification by entering its number</div>
      <form class="search-form">
        <div class="input-group">
          <input class="form-control" placeholder="Enter modification number" title="Key 1-20 digits" required>
          <button class="btn btn-primary btn-raised">${App.getIcon('search')}&nbsp;Search</button>
        </div>
      </form>
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
  keys.sort((a, b) => App.mods[a].order - App.mods[b].order); // Ascending order

  table.empty();
  table.append(tableHeader, keys.map((key) => {
    const i = App.mods[key];
    const { name, type, number, order, img, price } = i || {};
    const item = $(`
      <div class="tr">
        <div class="td sr-img"${App.getBackgroundImage(img)}></div>
        <div class="td sr-number">${number}</div>
        <div class="td sr-order">${order}</div>
        <div class="td sr-name">${name}</div>
        <div class="td sr-price">${price} ${App.settings.currency.symbol}</div>
        <div class="td sr-type">${type}</div>
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
  const { name, type, order, img, eans, price } = item || { };
  const imgStyle = App.getBackgroundImage(img);
  const modalTitle = `${item ? 'Edit' : 'Create'} modification - ${number}`;
  const form = $(`
    <form class="mod-item">
      <div class="form-row">
        <div class="img-upload">
          <label class="bmd-label-static">Image</label>
          <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
          <input class="hidden" name="img" value="${img || ''}">
          ${App.getCloudinaryUploadTag({ tags: ['mod'] })}
        </div>
        <div class="form-col">
          <div class="form-row">
            ${App.generateFormInput({ label: 'Number', name: 'number', value: number, disabled: true, type: 'number', min: 0 })}
            ${App.generateFormInput({ label: 'Order', name: 'order', value: isNaN(order) ? 0 : order, type: 'number', min: 0 })}
          </div>
          ${App.generateFormInput({ label: 'Name', name: 'name', value: name || '' })}
          <div class="form-row">
            ${App.generateFormInput({ label: 'Type', name: 'type', value: type || '' })}
            ${App.generateFormInput({ label: 'Price', name: 'price', value: price || Number(0).formatMoney() })}
          </div>
          ${App.generateFormInput({ label: 'EANs', name: 'eans', value: eans ? Object.keys(eans) : '', optional: true })}
        </div>
      </div>
      <div class="mi-control">
        ${item ? `<button type="button" class="btn btn-danger btn-delete">Delete</button>` : ''}
        <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
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
