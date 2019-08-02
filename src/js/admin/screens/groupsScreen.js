const tableHeader = `
  <div class="tr groups-table-header">
    <div class="td sr-img">Image</div>
    <div class="td sr-number">Number</div>
    <div class="td sr-order">Order</div>
    <div class="td sr-name">Name</div>
    <div class="td sr-products">Products</div>
    <div class="td sr-edit">Edit</div>
  </div>
`;

App.renderGroupsScreen = () => {
  const groupKeys = Object.keys(App.groups);
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Groups</div>
      <div class="d-flex justify-content-flex-end">
        <div class="cp-control">${groupKeys.length}&nbsp;<i class="material-icons">storage</i></div>
        <button class="btn btn-primary"><i class="material-icons">import_export</i>&nbsp;Import/Export</button>
      </div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
    <div class="card-body">
      <div class="card-text">Tip: Add or edit group by entering its number</div>
      <form id="group-addition">
        <div class="input-group">
          <input class="form-control" placeholder="Enter group number" title="Key 1-20 digits" required>
          <button class="btn btn-primary btn-raised"><i class="material-icons">search</i>&nbsp;Search</button>
        </div>
      </form>
      <div id="groups-table" class="table"></div>
    </div>
  `);
  App.jGroupsContainer = cpBody.find('#groups-table');
  const form = cpBody.find('#group-addition');
  const input = form.find('input');
  
  form.submit((e) => {
    e.preventDefault();
    const number = input.val();
    if (number && !isNaN(number)) {
      showGroupEditForm(number, App.renderGroupsTable);
    } 
  });
  
  App.renderGroupsTable();
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
  setTimeout(() => input.focus(), 100);
};

App.renderGroupsTable = () => {
  const groupKeys = Object.keys(App.groups);
  groupKeys.sort((a, b) => App.groups[a]['order'] - App.groups[b]['order']); // Ascending order

  App.jGroupsContainer.empty();
  App.jGroupsContainer.append(tableHeader);
  groupKeys.forEach((key) => {
    const group = App.groups[key];
    const { name, number, order, img } = group || {};
    const nProducts = App.getNumberOfProductsInGroup(number);
    const item = $(`
      <div class="tr search-result">
        <div class="td sr-img"${App.getBackgroundImage(img)}></div>
        <div class="td sr-number">${number}</div>
        <div class="td sr-order">${order}</div>
        <div class="td sr-name">${name}</div>
        <div class="td sr-products">${nProducts}</div>
        <button class="td sr-edit btn btn-primary"><i class="material-icons">edit</i></button>
      </div>
    `);
    item.children('.sr-edit, .sr-name, .sr-img').click(() => {
      showGroupEditForm(number, App.renderGroupsTable);
    });
    App.jGroupsContainer.append(item);
  });
};

const showGroupEditForm = (number, cb) => {
  if (!cb) cb = () => {};
  const group = App.groups[number];
  const { name, order, img } = group || {};
  const imgStyle = App.getBackgroundImage(img);
  const form = $(`
    <form class="mod-item">
      <p class="h4 mb-4">${group ? 'Edit' : 'Create'} group - ${number}</p>
      <div class="form-row">
        <div class="form-col">
          <div class="img-upload">
            <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : '<i class="material-icons">image</i>'}</div>
            <input class="hidden" name="img" value="${img || ''}">
          </div>
        </div>
        <div class="form-col">
          <div class="form-row">
            ${App.generateFormInput({ label: 'Number', name: 'number', value: number, disabled: true, type: 'number', min: 0 })}
            ${App.generateFormInput({ label: 'Order', name: 'order', value: isNaN(order) ? '' : order, type: 'number', min: 0 })}
          </div>
          ${App.generateFormInput({ label: 'Name', name: 'name', value: name || '' })}
        </div>
      </div>
      <div class="form-btns">
        ${group ? `<button type="button" class="btn btn-danger btn-delete">Delete</button>` : ''}
        <button class="btn btn-primary btn-raised btn-save">Save</button>
      </div>
    </form>
  `);
  
  const btnSave = form.find('.btn-save');
  const btnDelete = form.find('.btn-delete');
  form.submit((e) => {
    e.preventDefault();
    btnSave.text('Saving').removeClass('btn-success btn-danger');
    const data = App.serializeForm(form);
    App.saveGroup(data).done(() => {
      btnSave.text('Saved').addClass('btn-success');
    }).fail(() => {
      btnSave.text('Failed to save').addClass('btn-danger');
    }).always(cb);
  });
  form.find('.btn-delete').click(() => {
    const nProductsInGroup = App.getNumberOfProductsInGroup(number);
    if (nProductsInGroup) {
      return App.showWarning(`
        <div>You must delete all products (${nProductsInGroup}) of this group first</div>
        <div class="table">
          <div class="tr groups-table-header">
            <div class="td sr-ean">Code</div>
            <div class="td sr-name">Name</div>
          </div>
          ${Object.keys(App.products).filter((ean) => {
            return number == App.products[ean].group;
          }).map((ean) => {
            const { name } = App.products[ean];
            return `
              <div class="tr search-result">
                <div class="td sr-number">${ean}</div>
                <div class="td sr-name">${name}</div>
              </div>
            `;
          }).join('')}
        </div>
      `);
    }
    // must confirm (click delete twice) to delete
    if (!btnDelete.attr('data-ready')) {
      btnDelete.text('Confirm delete').attr('data-ready', true);
    } else {
      btnDelete.text('Deleting').removeAttr('data-ready');
      App.deleteGroup(number).done(() => {
        btnDelete.text('Deleted').addClass('btn-success');
      App.closeModal();
      }).fail(() => {
        btnDelete.text('Failed to delete').addClass('btn-danger');
      }).always(cb);
    }
  });
  App.showInModal(form);
};
