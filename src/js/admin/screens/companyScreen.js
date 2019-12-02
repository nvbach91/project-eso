const vatRegisterationOptions = [
  { label: "REGISTERED", value: true, },
  { label: "NOT REGISTERED", value: false, }
];

App.renderCompanyScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Company</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`<div class="card-body"></div>`);
  const companyForm = $(`
    <form class="mod-item card">
      <div class="mi-header">Settings</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Name', name: 'companyName', value: App.settings.companyName })}
          ${App.generateFormInput({ label: 'Subdomain', name: 'subdomain', value: App.settings.subdomain, disabled: true })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'VAT', name: 'vat', value: App.settings.vat })}
          ${App.generateFormInput({ label: 'TIN', name: 'tin', value: App.settings.tin, disabled: true })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Street', name: 'residence.street', value: App.settings.residence.street })}
          ${App.generateFormInput({ label: 'City', name: 'residence.city', value: App.settings.residence.city })}
          ${App.generateFormInput({ label: 'Zip', name: 'residence.zip', value: App.settings.residence.zip })}
          ${App.generateFormInput({ label: 'Country', name: 'residence.country', value: App.settings.residence.country })}
        </div>
        ${App.generateFormSelect({ label: 'VAT registration status', name: 'vatRegistered', value: App.settings.vatRegistered, options: vatRegisterationOptions })}
        ${App.generateFormInput({ label: 'Bank', name: 'bank', value: App.settings.bank || '', optional: true })}
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(companyForm, '/company');
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};
