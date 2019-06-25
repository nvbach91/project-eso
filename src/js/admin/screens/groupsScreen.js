const tableHeader = `
  <div class="tr groups-table-header">
    <div class="td sr-img">Image</div>
    <div class="td sr-number">Number</div>
    <div class="td sr-id">Id</div>
    <div class="td sr-name">Name</div>
    <div class="td sr-edit">Edit</div>
  </div>
`;

App.renderGroupsScreen = () => {
    const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Groups</div>
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
        <div id="groups-table" class="table"></div>
    </div>
    `);
    App.jGroupsContainer = cpBody.find('#groups-table');
    App.renderGroupsTable();
    
    App.jControlPanelBody.replaceWith(cpBody);
    App.jControlPanelBody = cpBody;
}

App.renderGroupsTable = (groupsContainer) => {
    const groupKeys = Object.keys(App.groups);

    App.jGroupsContainer.empty();
    App.jGroupsContainer.append(tableHeader);
    for (let i = 0; i < groupKeys.length; i++) {
        const group = App.groups[groupKeys[i]];
        const { name, number, img } = group || {};
        const style = ` style="background-image: url(${img})"`;
        const item = $(`
            <div class="tr search-result">
                <div class="td sr-img" ${style}></div>
                <div class="td sr-number">${number}</div>
                <div class="td sr-id">${groupKeys[i]}</div>
                <div class="td sr-name">${name}</div>
                <button class="td sr-edit btn btn-primary"><i class="material-icons">edit</i></button>
            </div>
        `);
        item.children('.sr-edit, .sr-name').click(() => {
            App.showProductEditForm(ean, () => input.keyup());
        });
        App.jGroupsContainer.append(item);
    }
}