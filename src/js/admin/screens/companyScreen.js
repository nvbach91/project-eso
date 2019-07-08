var isTaxable = true;

const taxable = {
  taxable: {
    text: "TAXABLE",
    value: true,
  },
  not_taxable: {
    text: "NOT TAXABLE",
    value: false,
  }
}

App.renderCompanyScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Company</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
  <div>
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5>Manage company</h5>
    </div>
    <form class="mod-item">
      <div class="mi-header">Settings</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Name', name: 'name', value: App.settings.name || '' })}
          ${App.generateFormInput({ label: 'Subdomain', name: 'subdomain', value: App.settings.subdomain || '', disabled: true })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Vat', name: 'vat', value: App.settings.vat || 0 })}
          ${App.generateFormInput({ label: 'Tin', name: 'tin', value: App.settings.tin || 0 , disabled: true })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Street', name: 'street', value: App.settings.residence.street || '' })}
          ${App.generateFormInput({ label: 'City', name: 'city', value: App.settings.residence.city || '' })}
          ${App.generateFormInput({ label: 'Zip', name: 'zip', value: App.settings.residence.zip || '' })}
          ${App.generateFormInput({ label: 'Country', name: 'country', value: App.settings.residence.country || '' })}
        </div>
        ${App.generateIsTaxableSelect(isTaxable)}
        ${App.generateFormInput({ label: 'Bank', name: 'bank', value: '' })}
        <div class="mi-control">
          <button id="save-settings" class="btn btn-primary btn-raised mi-btn">Save</button>
        </div>
      </div>
    </form>
  </div>
  `);;
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
}

App.generateIsTaxableSelect = (selected) => {
  return `
    <div class="form-group">
      <label>Is taxable?</label>
      <select class="custom-select" name="currency" required>
        ${Object.keys(taxable).map((tax) => {
          const { text, value } = taxable[tax];
          return `<option value="${tax}"${selected == value ? ' selected' : ''}>${text}</option>`;
        }).join('')}
      </select>
    </div>
  `;
};