App.generateFormInput = (args) => {
  const { label, name, value, optional, disabled, type, step, title, minlength } = args;
  const { width, min, max, hidden, accept, placeholder, autocomplete, pattern } = args;
  const style = `${width ? `max-width: ${width}px;` : ''}${hidden ? ` display: none;` : ''}`;
  // some name values will include the index, such as 'labelPrinters.0.ip', 'labelPrinters.1.ip'
  let finalLabel = label || App.lang[`form_${name}`] || name;
  if (/.+s\.[a-z0-9]+\..+/.test(finalLabel)) {
    finalLabel = App.lang[`form_${finalLabel.replace(/s\.[a-z0-9]+\./, '.')}`];
  }
  return `
    <div class="form-group"${style ? ` style="${style}"` : ''}>
      <label>${finalLabel}</label>
      <input
        ${title ? ` title="${title}"` : ''}
        ${type ? ` type="${type}"` : ''}
        ${type === 'password' && !autocomplete ? ` autocomplete="new-password"` : ''}
        ${autocomplete ? ` autocomplete="${autocomplete}"` : ' autocomplete="off"'}
        ${accept ? ` accept="${accept}"` : ''}
        ${step ? ` step="${step}"` : ''}
        ${minlength ? ` minlength="${minlength}"` : ''}
        ${min !== undefined ? ` min="${min}"` : ''}
        ${max !== undefined ? ` max="${max}"` : ''}
        class="form-control"
        name="${name}"
        ${pattern ? `pattern="${pattern.source.replace(/^\^/, '').replace(/\$$/, '')}"` : ''}
        ${value !== undefined ? `value="${value}"` : ''}
        ${placeholder ? `placeholder="${placeholder}"` : ''}
        ${optional ? '' : ' required'}
        ${disabled ? ' readonly' : ''}
      >
      ${optional ? '' : '<i>*</i>'}
    </div>
  `;
};

App.generateFormSelect = (args) => {
  const { label, name, value, options, optional, type, width, multiple, title } = args;
  const selected = value;
  const style = `${width ? `max-width: ${width}px;` : ''}`;
  // some name values will include the index, such as 'labelPrinters.0.ip', 'labelPrinters.1.ip'
  let finalLabel = label || App.lang[`form_${name}`] || name;
  if (/.+s\.[a-z0-9]+\..+/.test(finalLabel)) {
    finalLabel = App.lang[`form_${finalLabel.replace(/s\.[a-z0-9]+\./, '.')}`];
  }
  return `
    <div class="form-group"${style ? ` style="${style}"` : ''}>
      <label>${finalLabel}</label>
      <select
        class="custom-select"
        ${title ? ` title="${title}"` : ''}
        name="${name}"${optional ? '' : ' required'}
        ${type ? ` type="${type}"` : ''}
        ${multiple ? ' multiple' : ''}
      >
        ${options.map((o) => {
    const { label, value } = o;
    return `<option value="${value}"${selected == value ? ' selected' : ''}>${label}</option>`;
  }).join('')}
      </select>
    </div>
  `;
};


App.bindForm = (form, endpoint) => {
  if (endpoint === '/ors') {
    const certificateUploadInput = form.find('input[name="ors.file"]');
    const encodedDataHolder = form.find('input[name="_content"]');
    const certificateUploadButton = form.find('input[name="ors.file_name"]').click((e) => {
      App.resetFileInput(certificateUploadInput);
      certificateUploadInput.click();
    });
    certificateUploadInput.change((e) => {
      const file = e.target.files[0];
      const size = file.size;
      const reader = new FileReader();
      reader.onload = () => {
        encodedCertificateFileContent = reader.result;
        if (typeof InstallTrigger !== 'undefined') { // detect firefox
          encodedCertificateFileContent = encodedCertificateFileContent.replace('octet-stream;', 'x-pkcs12;');
        }
        if (size > 10000) { // 10kB
          App.showWarning('Error: certificate file is too large');
        } else if (!/^data:application\/x-pkcs12;base64,\s*(?:(?:[A-Za-z0-9+\/]{4})+\s*)*[A-Za-z0-9+\/]*={0,2}\s*$/.test(encodedCertificateFileContent)) {
          App.showWarning('Error: invalid file type');
        } else {
          encodedDataHolder.val(encodedCertificateFileContent);
          certificateUploadButton.val(file.name);
        }
      };
      reader.readAsDataURL(file);
    });
  }
  const btnSave = form.find('.btn-save');
  form.find('input, select').change(() => {
    btnSave.removeClass('btn-success btn-fail').text('Save');
  });
  form.submit((e) => {
    e.preventDefault();
    App.ajaxSaving(btnSave);
    const data = App.serializeForm(form);
    if (data.currency) {
      const currencyCode = data.currency;
      delete data.currency;
      const currency = App.supportedCurrencies[currencyCode];
      Object.keys(currency).forEach((key) => {
        data[`currency.${key}`] = currency[key];
      });
    }
    if (endpoint === '/registration') {
      data.subdomain = data.subdomain.toLowerCase();
      data.email = data.email.toLowerCase();
    }
    if (endpoint === '/settings') {
      data.paymentMethods = App.settings.paymentMethods;
      if (typeof data.autoLogin === 'boolean') {
        if (data.autoLogin) {
          localStorage.setItem('autoLogin', JSON.stringify({
            username: App.user.username.split(':')[1],
            password: App.pasuwado,
          }));
        } else {
          localStorage.removeItem('autoLogin');
        }
      }
    }
    $.post({
      url: `${endpoint !== '/registration' ? App.apiPrefix : ''}${endpoint}`,
      beforeSend: App.attachToken,
      contentType: 'application/json',
      data: JSON.stringify(data),
    }).done((resp) => {
      App.ajaxSaveDone(btnSave)();
      if (endpoint === '/registration') {
        if (resp.success === false) {
          return App.showWarning(resp.msg);
        }
        App.showWarning(`
          <p>Registration successful. You can now access your account here:</p>
          <a class="btn btn-primary btn-raised" href="https://${data.subdomain}.${App.domain}.${App.realm}/admin">Access your account</a>
        `);
        form.remove();
        return;
      }
      const changes = resp.msg === 'srv_success' ? data : resp.msg;
      if (endpoint === '/slides') {
        App.settings.slides[changes._id] = changes;
        return;
      }
      if (endpoint === '/employee') {
        App.settings.employees[data.email] = { name: data.name, regId: data.regId };
        return;
      }
      if (endpoint === '/ors') {
        form.find('input[name="_upload_date"]').val(moment(resp.msg['ors.upload_date']).format(App.formats.dateTime));
        form.find('input[name="_valid_until"]').val(moment(resp.msg['ors.valid_until']).format(App.formats.dateTime));
      }
      Object.keys(changes).forEach((key) => {
        if (key.includes('.')) {
          const kps = key.split('.');
          if (kps.length === 2) {
            App.settings[kps[0]][kps[1]] = changes[key];
          } else if (kps.length === 3) {
            App.settings[kps[0]][kps[1]][kps[2]] = changes[key];
          }
        } else if (!key.startsWith('_')) { // keys that start with a underscore are ignored
          App.settings[key] = changes[key];
        }
      });
    }).fail((resp) => {
      App.ajaxSaveFail(btnSave)();
      if (resp.responseJSON) {
        App.showWarning(App.lang[resp.responseJSON.msg] || resp.responseJSON.msg);
      }
    });

    // set the payment terminal type at localhost
    if (data['terminal.port'] && data['terminal.type']) {
      $.post(`${App.localhostServerURL}/set-payment-terminal-config`, {
        config: JSON.stringify({
          type: data['terminal.type'],
          partial_approval: data['terminal.partial_approval'],
        }),
      });
    }
    if (endpoint === '/slides') {
      if (data.video.trim()) {
        form.find('video.img-holder').show().attr('src', data.video);
        form.find('div.btn.img-holder').hide();
      } else {
        form.find('video.img-holder').hide().attr('src', '');
        form.find('div.btn.img-holder').show();
      }
    }
  });
};

App.serializeForm = (form) => {
  const data = {};
  const serialized = form.serializeArray();
  serialized.forEach((input) => {
    if (input.name.startsWith('__')) {
      return false;
    }
    let value = input.value.trim();
    const inputType = form.find(`[name="${input.name}"]`).attr('type');
    if (inputType === 'number' && /\d+/.test(value)) {
      value = Number(value);
    } else if (input.name === 'eans') {
      const compositeValue = {};
      value.split(',').forEach((v) => {
        if (App.products[v.trim()]) {
          compositeValue[v.trim()] = true;
        }
      });
      form.find(`[name="${input.name}"]`).val(Object.keys(compositeValue).toString());
      value = compositeValue;
    } else if (value === 'undefined') {
      value = undefined;
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    data[input.name] = value;
  });
  return data;
};

App.bindCloudinaryFileUpload = (cloudinaryFileUploadInput, cloudinaryPublicIdHolder, imgHolder, originalSize, callback) => {
  imgHolder.off('click').click(() => {
    cloudinaryFileUploadInput.click();
  });
  const uploadOptions = {
    disableImageResize: false,
    maxFileSize: 3000000,                 // 20MB is an example value - no default
    loadImageMaxFileSize: 20000000,       // default is 10MB
    acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i
  };
  if (!originalSize) {
    uploadOptions.imageMaxWidth = 800;                   // 800 is an example value - no default
    uploadOptions.imageMaxHeight = 600;                  // 600 is an example value - no default
  }
  cloudinaryFileUploadInput.cloudinary_fileupload(uploadOptions);
  cloudinaryFileUploadInput.bind('cloudinarydone', (e, data) => {
    if (typeof callback === 'function') {
      callback(data.result.public_id);
    }
    cloudinaryPublicIdHolder.val(data.result.public_id);
    imgHolder.empty().attr('style', App.getBackgroundImage(data.result.public_id).slice(8, -1));
    //uncomment to allow reupload of the same file in the same fileupload instance
    //App.resetFileInput(cloudinaryFileUploadInput);

    // bind again to allow change of file
    App.bindCloudinaryFileUpload(cloudinaryFileUploadInput, cloudinaryPublicIdHolder, imgHolder, originalSize, callback);
    return true;
  });
};

App.getCloudinaryUploadTag = (options) => {
  let tags = [App.settings._id];
  if (options && options.tags) {
    options.tags.forEach((tag) => tags.push(tag));
  }
  const dfd = JSON.stringify({
    upload_preset: 'r9ktkupy',
    callback: `${location.origin}/cloudinary_cors.html`,
    tags: tags.join(',')
  }).replace(/"/g, '&quot;');
  return `<input class="cloudinary-fileupload" name="file" type="file" data-form-data="${dfd}">`;
};

App.ajaxSaving = (btn) => {
  btn.prop('disabled', true).text(App.lang.misc_saving).removeClass('btn-success btn-danger');
};

App.ajaxSaveDone = (btn) => () => {
  btn.prop('disabled', false).text(App.lang.misc_saved).addClass('btn-success');
};

App.ajaxSaveFail = (btn) => (err) => {
  btn.prop('disabled', false).text(App.lang.misc_save_failed).addClass('btn-danger');
  if (err && err.responseJSON) {
    App.showAlert(err.responseJSON.msg, 'alert-danger');
  }
};

App.ajaxDeleting = (btn) => {
  btn.prop('disabled', true).text(App.lang.misc_deleting).removeData('ready');
};

App.ajaxDeleteDone = (btn) => () => {
  btn.prop('disabled', false).text(App.lang.misc_deleted).addClass('btn-success');
  App.closeModal();
};

App.ajaxDeleteFail = (btn) => (err) => {
  btn.prop('disabled', false).text(App.lang.misc_delete_failed).addClass('btn-danger');
  if (err && err.responseJSON) {
    App.showAlert(err.responseJSON.msg, 'alert-danger');
  }
};

App.resetFileInput = (input) => {
  input.wrap('<form>').closest('form').get(0).reset();
  input.unwrap();
};
