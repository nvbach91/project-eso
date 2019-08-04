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
          ${App.generateFormInput({ label: 'Number', name: 'number', value: App.settings.number, disabled: true, type: 'number' })}
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
          ${App.generateFormInput({ type: 'password', label: 'Certificate password', name: '_password', value: '' })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Certificate file', name: 'ors.file_name', placeholder: App.settings.ors.file_name })}
          ${App.generateFormInput({ type: 'file', hidden: true, label: 'Certificate file', name: 'ors.file', accept: '.p12', optional: true })}
          ${App.generateFormInput({ hidden: true, label: '', name: '_content', optional: true })}
          ${App.generateFormInput({ label: 'Upload date', name: '_upload_date', value: moment(App.settings.ors.upload_date).format(App.formats.dateTime), optional: true, disabled: true })}
          ${App.generateFormInput({ label: 'Valid until', name: '_valid_until', value: moment(App.settings.ors.valid_until).format(App.formats.dateTime), optional: true, disabled: true })}
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

  const imgStyle = App.getBackgroundImage(App.settings.receipt.img);
  const receiptForm = $(`
    <form class="mod-item card">
      <div class="mi-header">Receipt</div>
      <div class="mi-body">
        <div class="form-row">
          <div class="form-col" style="width: 200px">
            <div class="img-upload">
              <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : '<i class="material-icons">file_upload</i>'}</div>
              <input class="hidden" name="receipt.img" value="${App.settings.receipt.img || ''}">
              ${App.getCloudinaryUploadTag({ tags: ['receipt'] })}
            </div>
          </div>
          <div class="form-col">
            ${App.generateFormInput({ type: 'number', min: 0, label: 'Extra column padding', name: 'receipt.extraPadding', value: App.settings.receipt.extraPadding })}
            ${App.generateFormInput({ label: 'Header', name: 'receipt.header', value: App.settings.receipt.header, optional: true })}
            ${App.generateFormInput({ label: 'Footer', name: 'receipt.footer', value: App.settings.receipt.footer, optional: true })}
          </div>
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(receiptForm, '/settings');
  App.bindCloudinaryFileUpload(
    receiptForm.find('input.cloudinary-fileupload[type=file]'), 
    receiptForm.find('input[name="receipt.img"]'), 
    receiptForm.find('.img-holder')
  );
  if (imgStyle) {
    const removeBtn = $('<button type="button" class="close">×</button>').prependTo(receiptForm.find('.img-upload'));
    removeBtn.click(() => {
      receiptForm.find('.img-holder').removeAttr('style');
      receiptForm.find('input[name="receipt.img"]').val('');
      App.resetFileInput(receiptForm.find('input.cloudinary-fileupload[type=file]'));
      removeBtn.next().append('<i class="material-icons">file_upload</i>');
    });
  }
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};
