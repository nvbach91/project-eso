
App.renderCompanyScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_company}</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`<div class="card-body"></div>`);
  createCompanySettingsForm().appendTo(cpBody);
  createEmployeeSettingsForm().appendTo(cpBody);
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};


const createCompanySettingsForm = () => {
  const { img } = App.settings;
  const imgStyle = App.getBackgroundImage(img);
  const form = $(`
    <form class="mod-item card">
      <div class="mi-header">${App.lang.settings_company}</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'companyName', value: App.settings.companyName })}
          ${App.generateFormInput({ name: 'subdomain', value: App.settings.subdomain, disabled: true })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'vat', value: App.settings.vat })}
          ${App.generateFormInput({ name: 'tin', value: App.settings.tin, disabled: true })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'residence.street', value: App.settings.residence.street })}
          ${App.generateFormInput({ name: 'residence.city', value: App.settings.residence.city })}
          ${App.generateFormInput({ name: 'residence.zip', value: App.settings.residence.zip })}
          ${App.generateFormInput({ name: 'residence.country', value: App.settings.residence.country })}
        </div>
        <div class="form-row"> 
          <div class="img-upload">
            <label class="bmd-label-static">${App.lang.form_image}</label>
            <div class="btn img-holder"${imgStyle}>${imgStyle ? '' : App.getIcon('file_upload')}</div>
            <input class="hidden" name="img" value="${img || ''}">
            ${App.getCloudinaryUploadTag({ tags: ['company-img'] })}
          </div>
          <div class="form-col"> 
            ${App.generateFormSelect({  name: 'vatRegistered', value: App.settings.vatRegistered, options: App.vatRegisterationOptions })}
            ${App.generateFormInput({ name: 'bank', value: App.settings.bank || '', optional: true })}
            ${App.generateFormSelect({ name: 'theme', value: App.settings.theme, options: App.themeOptions })}
          </div>
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `);
  form.find('select[name="theme"]').change(function () {
    const t = $(this);
    const selectedTheme = App.availableThemes[t.children('option:selected').val()];
    if (selectedTheme) {
      $('#theme').attr('href', selectedTheme);
    }
  });
  App.bindCloudinaryFileUpload(
    form.find('input.cloudinary-fileupload[type=file]'), 
    form.find('input[name="img"]'), 
    form.find('.img-holder')
  );
  App.bindForm(form, '/company');
  return form;
};

const createEmployeeSettingsForm = () => {
  const card = $(`
    <div class="mod-item card">
      <div class="mi-header">
        <span>${App.lang.settings_employees}</span>
        <button class="btn btn-secondary btn-raised btn-add">${App.lang.misc_add}</button>
      </div>
      <div class="mi-body"></div>
    </div>
  `);
  const miBody = card.find('.mi-body');
  card.find('.btn-add').click(() => {
    const formRow = createEmployeeFormRow({
      email: '',
      name: '',
      newpassword: '',
    });
    miBody.prepend(formRow);
  });
  const employeeEmails = Object.keys(App.settings.employees);
  employeeEmails.forEach((employeeEmail) => {
    const name = App.settings.employees[employeeEmail];
    const formRow = createEmployeeFormRow({
      email: employeeEmail,
      name,
      newpassword: '',
    });
    miBody.append(formRow);
  });
  return card;
};

const createEmployeeFormRow = (employee) => {
  const formRow = $(`
    <form class="form-row">
      <div class="form-row">
        ${App.generateFormInput({ name: 'email', type: 'email', value: employee.email, disabled: !!employee.email })}
        ${App.generateFormInput({ name: 'name', value: employee.name })}
        ${App.generateFormInput({ name: 'newpassword', type: 'password', optional: !!employee.email, minlength: 8 })}
      </div>
      <div class="mi-control">
        <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        <button type="button" class="btn btn-danger btn-delete">${App.lang.misc_delete} ${App.getIcon('close')}</button>
      </div>
    </form>
  `);
  App.bindForm(formRow, '/employee');
  const btnDelete = formRow.find('.btn-delete');
  btnDelete.click(() => {
    // must confirm (click delete twice) to delete
    if (!btnDelete.data('ready')) {
      btnDelete.addClass('btn-raised').text('Confirm delete').data('ready', true);
    } else {
      App.deleteEmployee([App.subdomain, employee.email].join(':'), btnDelete);
    }
  });
  return formRow;
};
