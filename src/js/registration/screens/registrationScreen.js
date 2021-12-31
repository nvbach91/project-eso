
App.renderRegistrationScreen = () => {
  const languageOptions = Object.keys(App.supportedLocales).map((locale) => ({ label: App.supportedLocales[locale], value: locale }));
  const currencyOptions = Object.keys(App.supportedCurrencies).map((code) => ({ label: App.supportedCurrencies[code].symbol, value: code }));
  const screen = $(`
    <main id="main">
      <div class="screen registration-screen"></div>
    </main>
  `);
  const form = $(`
    <form class="mod-item card">
      <div class="mi-header">Registration</div>
      <div class="mi-body">
        <div class="form-row"> 
          <div class="form-col"> 
            ${App.generateFormInput({ name: 'tin', pattern: App.regex.tin.regex })}
            <button type="button" class="btn btn-primary" id="ares-btn">${App.getIcon('search')}</button>
          </div>
          <div class="form-col">
            ${App.generateFormInput({ name: 'vat', optional: true })}
          </div>
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'companyName' })}
          ${App.generateFormInput({ name: 'subdomain' })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'email', type: 'email' })}
          ${App.generateFormInput({ name: 'phone' })}
          ${App.generateFormInput({ name: 'password', type: 'password' })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'residence.street' })}
          ${App.generateFormInput({ name: 'residence.city' })}
          ${App.generateFormInput({ name: 'residence.zip' })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'residence.country' })}
          ${App.generateFormSelect({ name: 'language', value: App.locale, options: languageOptions, width: 160 })}
          ${App.generateFormSelect({ name: 'currency', value: 'CZK', options: currencyOptions, width: 160 })}
        </div>
        <input type="hidden" name="token">
        <button class="hidden" id="submit">Submit</button>
      </div>
      <div class="mi-control">
        <button class="btn btn-primary btn-raised btn-submit btn-save" type="button" id="submit-btn">Submit ${App.getIcon('save')}</button>
      </div>
    </form>
  `);
  App.jRegistrationScreen = screen.find('.registration-screen');
  App.jRegistrationScreen.append(form);
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.bindForm(form, '/registration');
  form.find('#ares-btn').click(function () {
    const tin = form.find('input[name="tin"]').val().trim();
    if (!App.regex.tin.regex.test(tin)) {
      return false;
    }
    $(this).prop('disabled', true);
    $.post('/ares', { tin: tin, ignoreRegistered: true }).done((res) => {
      if (!res.success) {
        return App.showWarning(`${res.msg} ${res.msg2 || ''}`);
      }
      form.find('[name="vat"]').val(res.msg.vat);
      form.find('[name="companyName"]').val(res.msg.name);
      form.find('[name="residence.street"]').val(res.msg.street);
      form.find('[name="residence.city"]').val(res.msg.city);
      form.find('[name="residence.zip"]').val(res.msg.zip);
      form.find('[name="residence.country"]').val(res.msg.country);
      form.find('[name="subdomain"]').val(App.removeDiacritics(res.msg.name).replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
    }).always(() => {
      $(this).prop('disabled', false);
    });
  });
  form.find('#submit-btn').click(() => {
    grecaptcha.ready(() => {
      const siteKey = $('#recaptcha-script').attr('src').split('=')[1];
      grecaptcha.execute(siteKey, { action: 'submit' }).then((token) => {
        form.find('[name="token"]').val(token);
        form.find('#submit').click();
      });
    });
  })
};
