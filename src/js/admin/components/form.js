App.generateFormInput = (args) => {
  const { label, name, value, optional, disabled, type, step, width, min, max, hidden, accept, placeholder, autocomplete } = args;
  const style = `${width ? `max-width: ${width}px;` : ''}${hidden ? ` display: none;` : ''}`;
  return `
    <div class="form-group"${style ? ` style="${style}"` : ''}>
      <label>${label}</label>
      <input
        ${type ? ` type="${type}"` : ''}
        ${autocomplete ? ` autocomplete="${autocomplete}"` : ' autocomplete="off"'}
        ${accept ? ` accept="${accept}"` : ''}
        ${step ? ` step="${step}"` : ''}
        ${min !== undefined ? ` min="${min}"` : ''}
        ${max !== undefined ? ` max="${max}"` : ''}
        class="form-control"
        name="${name}"
        ${value !== undefined ? `value="${value}"` : ''}
        ${placeholder ? `placeholder="${placeholder}"` : ''}
        ${optional ? '' : ' required'}
        ${disabled ? ' readonly' : ''}>
      ${optional ? '' : '<i>*</i>'}
    </div>
  `;
};

App.generateFormSelect = (args) => {
  const { label, name, value, options, optional, type, width } = args;
  const selected = value;
  const style = `${width ? `max-width: ${width}px;` : ''}`;
  return `
    <div class="form-group"${style ? ` style="${style}"` : ''}>
      <label>${label}</label>
      <select class="custom-select" name="${name}"${optional ? '' : ' required'}${type ? ` type="${type}"` : ''}>
        ${options.map((o) => {
          const { label, value } = o;
          return `<option value="${value}"${selected == value ? ' selected' : ''}>${label}</option>`;
        }).join('')}
      </select>
    </div>
  `;
};

App.binarySelectOptions = [
  { label: 'Yes', value: true }, 
  { label: 'No', value: false }
];


App.bindForm = (form, endpoint) => {
  if (endpoint === '/ors') {
    var certificateUploadInput = form.find('input[name="ors.file"]');
    const certificateUploadButton = form.find('input[name="ors.file_name"]').click((e) => {
      certificateUploadInput.removeData('content');
      certificateUploadInput.wrap('<form>').closest('form').get(0).reset();
      certificateUploadInput.unwrap();
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
          certificateUploadInput.data('content', encodedCertificateFileContent);
          certificateUploadButton.val(file.name);
        }
      };
      reader.readAsDataURL(file);
    });
  }
  const btnSave = form.find('.btn-save');
  form.submit((e) => {
    btnSave.removeClass('btn-success btn-danger');
    e.preventDefault();
    const data = App.serializeForm(form);
    if (endpoint === '/ors') {
      data.content = certificateUploadInput.data('content') || '';
    }
    $.post({
      url: `${App.apiPrefix}${endpoint}`,
      beforeSend: App.attachToken,
      contentType: 'application/json',
      data: JSON.stringify(data),
    }).done((resp) => {
      btnSave.addClass('btn-success');
      if (endpoint === '/ors') {
        form.find('input[name="upload_date"]').val(moment(resp.msg['ors.upload_date']).format(App.formats.dateTime));
        form.find('input[name="valid_until"]').val(moment(resp.msg['ors.valid_until']).format(App.formats.dateTime));
      }
    }).fail((resp) => {
      btnSave.addClass('btn-danger');
      App.showWarning(App.lang[resp.responseJSON.msg] || resp.responseJSON.msg);
    });
  });
};

App.serializeForm = (form) => {
  const data = {};
  const serialized = form.serializeArray();
  serialized.forEach((input) => {
    let value = input.value.trim();
    const inputType = form.find(`[name="${input.name}"]`).attr('type');
    if (inputType === 'number' && /\d+/.test(value)) {
      value = Number(value);
    }
    else if (value === 'undefined') value = undefined;
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    data[input.name] = value;
  });
  return data;
};
