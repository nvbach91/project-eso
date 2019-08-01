const currencyOptions = Object.keys(App.supportedCurrencies).map((code) => {
  return { label: `${code} - ${App.supportedCurrencies[code]}`, value: code };
});

App.renderKioskScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Kiosk</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`<div class="card-body"></div>`);
  const settingsForm = $(`
    <form class="mod-item card">
      <div class="mi-header">Settings</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Name', name: 'name', value: App.settings.name })}
          ${App.generateFormInput({ label: 'Number', name: 'number', value: App.settings.number, disabled: true })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Street', name: 'address.street', value: App.settings.address.street })}
          ${App.generateFormInput({ label: 'City', name: 'address.city', value: App.settings.address.city })}
          ${App.generateFormInput({ label: 'Zip', name: 'address.zip', value: App.settings.address.zip })}
          ${App.generateFormInput({ label: 'Country', name: 'address.country', value: App.settings.address.country })}
        </div>
        ${App.generateFormSelect({label: 'Currency', name: 'currency', value: App.settings.currency, options: currencyOptions })} 
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(settingsForm, '/settings');
  
  const orsForm = $(`
    <form class="mod-item card">
      <div class="mi-header">Fiscal settings</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'VAT', name: 'ors.vat', value: App.settings.ors.vat })}
          ${App.generateFormInput({ type: 'number', label: 'Store ID', name: 'ors.store_id', value: App.settings.ors.store_id })}
          ${App.generateFormInput({ type: 'password', label: 'Certificate password', name: 'password', value: '' })}
          ${App.generateFormInput({ label: 'Certificate file', name: 'ors.file_name', placeholder: App.settings.ors.file_name })}
          ${App.generateFormInput({ type: 'file', hidden: true, label: 'Certificate file', name: 'ors.file', accept: '.p12', optional: true })}
          ${App.generateFormInput({ label: 'Upload date', name: 'upload_date', value: App.settings.ors.upload_date, optional: true, disabled: true })}
          ${App.generateFormInput({ label: 'Valid until', name: 'valid_until', value: App.settings.ors.valid_until, optional: true, disabled: true })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(orsForm, '/ors');

  const timersForm = $(`
    <form class="mod-item card">
      <div class="mi-header">Timers</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ type: 'number', step: 1000, label: 'Activity Check Timeout (ms)', name: 'activityCheckTimeout', value: App.settings.activityCheckTimeout })}
          ${App.generateFormInput({ type: 'number', step: 1000, label: 'Activity Timeout (ms)', name: 'activityTimeout', value: App.settings.activityTimeout })}
          ${App.generateFormInput({ type: 'number', step: 1000, label: 'Carousel Interval (ms)', name: 'carouselInterval', value: App.settings.carouselInterval })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(timersForm, '/settings');

  const receiptForm = $(`
    <form class="mod-item card">
      <div class="mi-header">Receipt</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Image', name: 'receipt.img', value: App.settings.receipt.img, optional: true })}
          ${App.generateFormInput({ label: 'Header', name: 'receipt.header', value: App.settings.receipt.header, optional: true })}
          ${App.generateFormInput({ label: 'Footer', name: 'receipt.footer', value: App.settings.receipt.footer, optional: true })}
          ${App.generateFormInput({ type: 'number', min: 0, label: 'Extra column padding', name: 'receipt.extraPadding', value: App.settings.receipt.extraPadding })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(receiptForm, '/settings');

  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};
