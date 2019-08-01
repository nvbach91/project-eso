App.generateFormInput = (args) => {
  const { label, name, value, optional, disabled, type, step, width, min, max, hidden, accept, placeholder } = args;
  const style = `${width ? `max-width: ${width};` : ''}${hidden ? ` display: none;` : ''}`;
  return `
    <div class="form-group"${style ? ` style="${style}"` : ''}>
      <label>${label}</label>
      <input
        ${type ? ` type="${type}"` : ''}
        ${type === 'password' ? ` autocomplete="off"` : ''}
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
  const { label, name, value, options } = args;
  const selected = value;
  return `
    <div class="form-group">
      <label>${label}</label>
      <select class="custom-select" name="${name}">
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
    btnSave.removeClass('btn-success');
    e.preventDefault();
    const data = {};
    form.serializeArray().forEach((input) => data[input.name] = input.value.trim());
    if (endpoint === '/ors') {
      data.content = certificateUploadInput.data('content') || '';
    }
    $.post({
      url: `${App.apiPrefix}${endpoint}`,
      beforeSend: App.attachToken,
      contentType: 'application/json',
      data: JSON.stringify(data),
    }).done(() => {
      btnSave.addClass('btn-success');
    });
  });
};
