
App.renderCompanyScreen = () => {
  const { img } = App.settings;
  const imgStyle = App.getBackgroundImage(img);
  const header = $(`
    <div id="cp-header" class="card-header">
    <div class="cp-name">${App.lang.admin_company}</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`<div class="card-body"></div>`);
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
  `).appendTo(cpBody);
  form.find('select[name="theme"]').change(function () {
    const t = $(this);
    const selectedTheme = App.availableThemes[t.children('option:selected').val()];
    if (selectedTheme) {
      $('#theme').attr('href', selectedTheme);
    }
  })
  App.bindCloudinaryFileUpload(
    form.find('input.cloudinary-fileupload[type=file]'), 
    form.find('input[name="img"]'), 
    form.find('.img-holder')
  );
  App.bindForm(form, '/company');
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};
