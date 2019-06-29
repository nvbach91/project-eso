const tableHeader = `
  <div class="tr groups-table-header">
    <div class="td sr-img">Image</div>
    <div class="td sr-number">Number</div>
    <div class="td sr-order">Order</div>
    <div class="td sr-name">Name</div>
    <div class="td sr-edit">Edit</div>
  </div>
`;

App.renderGroupsScreen = () => {
  const groupKeys = Object.keys(App.groups);
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Groups</div>
      <div class="cp-control">${groupKeys.length}&nbsp;<i class="material-icons">storage</i></div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
    <div>
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Manage groups</h5>
        <button class="btn btn-primary"><i class="material-icons">import_export</i>&nbsp;Import/Export</button>
      </div>
      <div class="card-body">
        <p class="card-text">Add or edit group by entering its number</p>
        <form id="group-addition">
          <div class="input-group">
            <input class="form-control" placeholder="Enter groups’ number" title="Key 1-20 digits" required>
            <button class="btn btn-primary btn-raised"><i class="material-icons">search</i>&nbsp;Search</button>
          </div>
        </form>
      </div>
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
      showGroupEditForm(number);
    } 
  });
  
  App.renderGroupsTable();
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
}

App.renderGroupsTable = () => {
  const groupKeys = Object.keys(App.groups);
  groupKeys.sort((a, b) => App.groups[a]["order"] - App.groups[b]["order"]); // Descending order

  App.jGroupsContainer.empty();
  App.jGroupsContainer.append(tableHeader);
  groupKeys.forEach((key) => {
    const group = App.groups[key];
    const { name, number, order, img } = group || {};
    const style = ` style="background-image: url(${img})"`;
    const item = $(`
      <div class="tr search-result">
        <div class="td sr-img" ${style}></div>
        <div class="td sr-number">${number}</div>
        <div class="td sr-order">${order}</div>
        <div class="td sr-name">${name}</div>
        <button class="td sr-edit btn btn-primary"><i class="material-icons">edit</i></button>
      </div>
    `);
    item.children('.sr-edit, .sr-name').click(() => {
      showGroupEditForm(number, () => input.keyup());
    });
    App.jGroupsContainer.append(item);
  });

  showGroupEditForm = (number, cb) => {
    if (!cb) cb = () => {};
    const group = App.groups[number];
    const { name, order, img } = group || {};
    const style = img ? ` style="background-image: url(${img})"` : '';
    const form = $(`
      <form>
        <p class="h4 mb-4">${group ? 'Edit' : 'Create'} group - ${number}</p>
        <div class="form-row">
          <div class="form-col">
            <div class="img-upload">
              <div class="btn img-holder"${style}>${style ? '' : '<i class="material-icons">image</i>'}</div>
              <input type="hidden" name="img" value="${img}">
            </div>
          </div>
          <div class="form-col">
            ${App.generateFormInput({ label: 'Number', name: 'number', value: number || '', disabled: true })}
            ${App.generateFormInput({ label: 'Name', name: 'name', value: name || '', required: true })}
            ${App.generateFormInput({ label: 'Order', name: 'order', value: isNaN(order) ? '' : order, required: true })}
          </div>
        </div>
        <div class="form-btns">
          ${group ? `<button type="button" class="btn btn-danger btn-delete">Delete</button>` : ''}
          <button class="btn btn-primary btn-raised btn-save">Save</button>
        </div>
      </form>
    `);
    /** TODO: Add Saving and Deletion of a group */
    /*
    form.submit((e) => {
      e.preventDefault();
      const btn = form.find('.btn-save').text('Saving');
      App.saveGroup({
        number: form.find('[name="number"]').val(),
        name: form.find('[name="name"]').val(),,
        order: parseInt(form.find('[name="order"]').val()),
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
        App.deleteGroup(number).done(() => {
        btn.text('Deleted').addClass('btn-success');
        App.closeModal();
        }).fail(() => {
        btn.text('Failed to delete').addClass('btn-danger');
        }).always(cb);
      }
    });
    */
    App.showInModal(form);
  }
}