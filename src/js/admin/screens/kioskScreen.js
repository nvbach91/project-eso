const currencyOptions = Object.keys(App.supportedCurrencies).map((code) => {
  const currency = App.supportedCurrencies[code];
  return { label: `${code} - ${currency.symbol}`, value: code };
});

App.renderKioskScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_kiosk}</div>
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
      <div class="mi-header">${App.lang.settings_general}</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'name', value: App.settings.name })}
          ${App.generateFormInput({ name: 'number', value: App.settings.number, disabled: true, type: 'number' })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'address.street', value: App.settings.address.street })}
          ${App.generateFormInput({ name: 'address.city', value: App.settings.address.city })}
          ${App.generateFormInput({ name: 'address.zip', value: App.settings.address.zip })}
          ${App.generateFormInput({ name: 'address.country', value: App.settings.address.country })}
        </div>
        ${App.generateFormSelect({ name: 'currency', value: App.settings.currency.code, options: currencyOptions })}
        <div class="form-row">
          <div class="form-group bmd-form-group is-filled">
            <label class="bmd-label-static">${App.lang.settings_payment_methods}</label>
            <div class="form-control">
              ${Object.keys(App.settings.paymentMethods).map((key) => {
                const active = App.settings.paymentMethods[key].enabled;
                return (`
                  <button type="button" class="payment-method-toggle btn-toggle btn${active ? ' btn-raised' : ''} btn-${active ? 'primary' : 'secondary'}" data-active="${active}" data-key="${key}">
                    ${App.lang[`checkout_${key}_pay_title`]} ${active ? App.getIcon('done', 14) : ''}
                  </button>
                `);
              }).join('')}
            </div>
          </div>
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `);
  App.bindForm(form, '/settings');
  App.bindToggleButtons(form, '.payment-method-toggle');
  form.find('.payment-method-toggle').click(function () {
    const t = $(this);
    App.settings.paymentMethods[t.data('key')].enabled = t.data('active');
  });
  return form;
};

const createOrsSettingsForm = () => {
  const form = $(`
    <form class="mod-item card">
      <div class="mi-header">${App.lang.settings_fiscal}</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'ors.vat', value: App.settings.ors.vat })}
          ${App.generateFormInput({ type: 'number', name: 'ors.store_id', value: App.settings.ors.store_id })}
          ${App.generateFormInput({ type: 'password', name: '_password', value: '' })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'ors.file_name', placeholder: App.settings.ors.file_name })}
          ${App.generateFormInput({ type: 'file', hidden: true, name: 'ors.file', accept: '.p12', optional: true })}
          ${App.generateFormInput({ hidden: true, name: '_content', optional: true })}
          ${App.generateFormInput({ name: '_upload_date', value: App.settings.ors.upload_date ? moment(App.settings.ors.upload_date).format(App.formats.dateTime) : '', optional: true, disabled: true })}
          ${App.generateFormInput({ name: '_valid_until', value: App.settings.ors.valid_until ? moment(App.settings.ors.valid_until).format(App.formats.dateTime) : '', optional: true, disabled: true })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
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
      <div class="mi-header">${App.lang.settings_interface}</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ type: 'number', step: 1000, name: 'activityCheckTimeout', value: App.settings.activityCheckTimeout })}
          ${App.generateFormInput({ type: 'number', step: 1000, name: 'activityTimeout', value: App.settings.activityTimeout })}
          ${App.generateFormInput({ type: 'number', step: 1000, name: 'carouselInterval', value: App.settings.carouselInterval })}
        </div>
        <div class="form-row">
          ${App.generateFormSelect({ name: 'autoNextTab', value: App.settings.autoNextTab, options: App.binarySelectOptions })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
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
      <div class="mi-header">${App.lang.settings_receipt}</div>
      <div class="mi-body">
        <div class="form-row">
          <div class="img-upload">
            <label class="bmd-label-static">${App.lang.form_image}</label>
            <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
            <input class="hidden" name="receipt.img" value="${App.settings.receipt.img || ''}">
            ${App.getCloudinaryUploadTag({ tags: ['receipt'] })}
          </div>
          <div class="form-col">
            ${App.generateFormInput({ type: 'number', min: 0, name: 'receipt.extraPadding', value: App.settings.receipt.extraPadding })}
            ${App.generateFormInput({ name: 'receipt.header', value: App.settings.receipt.header, optional: true })}
            ${App.generateFormInput({ name: 'receipt.footer', value: App.settings.receipt.footer, optional: true })}
            ${App.generateFormInput({ name: 'receipt.orderInitial', value: App.settings.receipt.orderInitial, optional: true })}
            ${App.generateFormSelect({ name: 'receipt.masking', value: App.settings.receipt.masking, options: App.binarySelectOptions })}
            ${App.generateFormSelect({ name: 'receipt.highlightOrderNumber', value: App.settings.receipt.highlightOrderNumber, options: App.binarySelectOptions })}
          </div>
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
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
        <span>${App.lang.settings_slides}</span>
        <button class="btn btn-secondary btn-raised btn-add">${App.lang.misc_add}</button>
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
    const { text, img, order, video } = App.settings.slides[_id];
    const formRow = createSlideFormRow({ _id, text, img, order, video });
    miBody.append(formRow);
  });
  return form;
};

const createSlideFormRow = (slide) => {
  const imgStyle = App.getBackgroundImage(slide.img);
  const formRow = $(`
    <form class="form-row">
      <div class="img-upload">
        <label class="bmd-label-static">${App.lang.form_image}</label>
        <video class="img-holder" autoplay muted loop src="${slide.video || ''}"></video>
        <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
        <input class="hidden" name="img" value="${slide.img || ''}">
        <input class="hidden" name="_id" value="${slide._id || ''}">
        ${App.getCloudinaryUploadTag({ tags: ['slide'] })} 
      </div>
      <div class="form-row">
        ${App.generateFormInput({ type: 'number', min: 0, name: 'order', value: slide.order })}
        ${App.generateFormInput({ name: 'text', value: slide.text, optional: true })}
        ${App.generateFormInput({ type: 'url', name: 'video', optional: true })}
      </div>
      <div class="mi-control">
        <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        <button type="button" class="btn btn-danger btn-delete">${App.lang.misc_delete} ${App.getIcon('close')}</button>
      </div>
    </form>
  `);
  if (slide.video) {
    // console.log(slide);
    formRow.find('input[name="video"]').val(slide.video);
    formRow.find('.btn.img-holder').hide();
  } else {
    formRow.find('video.img-holder').hide();
  }
  App.bindForm(formRow, '/slides');
  App.bindCloudinaryFileUpload(
    formRow.find('input.cloudinary-fileupload[type="file"]'), 
    formRow.find('input[name="img"]'), 
    formRow.find('.img-holder'),
    true // originalSize = no resizing
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