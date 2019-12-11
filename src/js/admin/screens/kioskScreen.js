const currencyOptions = Object.keys(App.supportedCurrencies).map((code) => {
  const currency = App.supportedCurrencies[code];
  return { label: `${code} - ${currency.symbol}`, value: code };
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
  createGeneralSettingsForm().appendTo(cpBody);
  createOrsSettingsForm().appendTo(cpBody);
  createInterfaceSettingsForm().appendTo(cpBody);
  createReceiptSettingsForm().appendTo(cpBody);
  createSlidesSettingsForm().appendTo(cpBody);
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};

const createGeneralSettingsForm = () => {
  const form = $(`
    <form class="mod-item card">
      <div class="mi-header">General settings</div>
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
        ${App.generateFormSelect({label: 'Currency', name: 'currency', value: App.settings.currency.code, options: currencyOptions })}
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `);
  App.bindForm(form, '/settings');
  return form;
};

const createOrsSettingsForm = () => {
  const form = $(`
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
          ${App.generateFormInput({ label: 'Upload date', name: '_upload_date', value: App.settings.ors.upload_date ? moment(App.settings.ors.upload_date).format(App.formats.dateTime) : '', optional: true, disabled: true })}
          ${App.generateFormInput({ label: 'Valid until', name: '_valid_until', value: App.settings.ors.valid_until ? moment(App.settings.ors.valid_until).format(App.formats.dateTime) : '', optional: true, disabled: true })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
          ${App.settings.ors.private_key ? `<button type="button" class="btn btn-danger btn-delete">Delete</button>` : ''}
        </div>
      </div>
    </form>
  `);
  const btnDelete = form.find('.btn-delete');
  btnDelete.click(() => {
    // must confirm (click delete twice) to delete
    if (!btnDelete.data('ready')) {
      btnDelete.addClass('btn-raised').text('Confirm delete').data('ready', true);
    } else {
      App.deleteOrs(btnDelete).done(() => {
        form.find('input').val('').removeAttr('placeholder');
        btnDelete.remove();
      });
    }
  });
  App.bindForm(form, '/ors');
  return form;
};

const createInterfaceSettingsForm = () => {
  const form = $(`
    <form class="mod-item card">
      <div class="mi-header">Interface settings</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ type: 'number', step: 1000, label: 'Activity Check Timeout (ms)', name: 'activityCheckTimeout', value: App.settings.activityCheckTimeout })}
          ${App.generateFormInput({ type: 'number', step: 1000, label: 'Activity Timeout (ms)', name: 'activityTimeout', value: App.settings.activityTimeout })}
          ${App.generateFormInput({ type: 'number', step: 1000, label: 'Carousel Interval (ms)', name: 'carouselInterval', value: App.settings.carouselInterval })}
        </div>
        <div class="form-row">
          ${App.generateFormSelect({ label: 'Automatically jump to next order tab', name: 'autoNextTab', value: App.settings.autoNextTab, options: App.binarySelectOptions })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `);
  App.bindForm(form, '/settings');
  return form;
};

const createReceiptSettingsForm = () => {
  const imgStyle = App.getBackgroundImage(App.settings.receipt.img);
  const form = $(`
    <form class="mod-item card">
      <div class="mi-header">Receipt settings</div>
      <div class="mi-body">
        <div class="form-row">
          <div class="img-upload">
            <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
            <input class="hidden" name="receipt.img" value="${App.settings.receipt.img || ''}">
            ${App.getCloudinaryUploadTag({ tags: ['receipt'] })}
          </div>
          <div class="form-col">
            ${App.generateFormInput({ type: 'number', min: 0, label: 'Extra column padding', name: 'receipt.extraPadding', value: App.settings.receipt.extraPadding })}
            ${App.generateFormInput({ label: 'Header', name: 'receipt.header', value: App.settings.receipt.header, optional: true })}
            ${App.generateFormInput({ label: 'Footer', name: 'receipt.footer', value: App.settings.receipt.footer, optional: true })}
          </div>
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `);
  App.bindForm(form, '/settings');
  App.bindCloudinaryFileUpload(
    form.find('input.cloudinary-fileupload[type="file"]'), 
    form.find('input[name="receipt.img"]'), 
    form.find('.img-holder')
  );
  if (imgStyle) {
    const removeBtn = $('<button type="button" class="close">×</button>').prependTo(form.find('.img-upload'));
    removeBtn.click(() => {
      form.find('.img-holder').removeAttr('style');
      form.find('input[name="receipt.img"]').val('');
      App.resetFileInput(form.find('input.cloudinary-fileupload[type="file"]'));
      removeBtn.next().append(App.getIcon('file_upload'));
    });
  }
  return form;
};

const createSlidesSettingsForm = () => {
  const form = $(`
    <div class="mod-item card">
      <div class="mi-header">
        <span>Slides settings</span>
        <button class="btn btn-success btn-raised btn-add">Add</button>
      </div>
      <div class="mi-body"></div>
    </div>
  `);
  const miBody = form.find('.mi-body');
  form.find('.btn-add').click(() => {
    const formRow = createSlideFormRow({ order: 0, img: '', text: '' });
    miBody.prepend(formRow);
  });
  const slideIds = Object.keys(App.settings.slides);
  slideIds.sort((a, b) => App.settings.slides[a].order - App.settings.slides[b].order);
  slideIds.forEach((_id) => {
    const { text, img, order } = App.settings.slides[_id];
    const formRow = createSlideFormRow({ _id, text, img, order });
    miBody.append(formRow);
  });
  return form;
};

const createSlideFormRow = (slide) => {
  const imgStyle = App.getBackgroundImage(slide.img);
  const formRow = $(`
    <form class="form-row">
      <div class="img-upload">
        <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
        <input class="hidden" name="img" value="${slide.img || ''}">
        <input class="hidden" name="_id" value="${slide._id || ''}">
        ${App.getCloudinaryUploadTag({ tags: ['slide'] })}
      </div>
      <div class="form-col">
        ${App.generateFormInput({ type: 'number', min: 0, label: 'Order', name: 'order', value: slide.order })}
        ${App.generateFormInput({ label: 'Button text', name: 'text', value: slide.text, optional: true })}
      </div>
      <div class="mi-control">
        <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
        <button type="button" class="btn btn-danger btn-delete">Delete ${App.getIcon('close')}</button>
      </div>
    </form>
  `);
  App.bindForm(formRow, '/slides');
  App.bindCloudinaryFileUpload(
    formRow.find('input.cloudinary-fileupload[type="file"]'), 
    formRow.find('input[name="img"]'), 
    formRow.find('.img-holder')
  );
  const btnDelete = formRow.find('.btn-delete');
  btnDelete.click(() => {
    // must confirm (click delete twice) to delete
    if (!btnDelete.data('ready')) {
      btnDelete.addClass('btn-raised').text('Confirm delete').data('ready', true);
    } else {
      App.deleteSlide(slide._id, btnDelete);
    }
  });
  return formRow;
};