App.renderCompanyScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Company</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
    <div class="card-body">
      <form class="mod-item">
        <div class="mi-header">Settings</div>
        <div class="mi-body">
          <div class="form-row"> 
            ${App.generateFormInput({ label: 'Name', name: 'name', value: App.settings.companyName })}
            ${App.generateFormInput({ label: 'Subdomain', name: 'subdomain', value: App.settings.subdomain, disabled: true })}
          </div>
          <div class="form-row"> 
            ${App.generateFormInput({ label: 'VAT', name: 'vat', value: App.settings.vat })}
            ${App.generateFormInput({ label: 'TIN', name: 'tin', value: App.settings.tin, disabled: true })}
          </div>
          <div class="form-row"> 
            ${App.generateFormInput({ label: 'Street', name: 'street', value: App.settings.residence.street })}
            ${App.generateFormInput({ label: 'City', name: 'city', value: App.settings.residence.city })}
            ${App.generateFormInput({ label: 'Zip', name: 'zip', value: App.settings.residence.zip })}
            ${App.generateFormInput({ label: 'Country', name: 'country', value: App.settings.residence.country })}
          </div>
          ${App.generateVatRegistrationSelect(App.settings.vatRegistered)}
          ${App.generateFormInput({ label: 'Bank', name: 'bank', value: App.settings.bank || '' })}
          <div class="mi-control">
            <button class="btn btn-primary btn-raised mi-btn">Save</button>
          </div>
        </div>
      </form>
    </div>
  `);;
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};

const vatRegisterationOptions = [
  { label: "REGISTERED", value: true, },
  { label: "NOT REGISTERED", value: false, }
];

App.generateVatRegistrationSelect = (selected) => {
  return `
    <div class="form-group">
      <label>VAT registration status</label>
      <select class="custom-select" name="vatRegistered" required>
        ${vatRegisterationOptions.map((o) => {
          const { label, value } = o;
          return `<option value="${value}"${selected == value ? ' selected' : ''}>${label}</option>`;
        }).join('')}
      </select>
    </div>
  `;
};
