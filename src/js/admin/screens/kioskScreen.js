const currencyOptions = [
  { label: 'CZK - Kč', value: 'CZK'},
  { label: 'EUR - €', value: 'EUR'},
];

App.renderKioskScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Kiosk</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
    <div class="card-body">
      <form class="mod-item">
        <div class="mi-header">Settings</div>
        <div class="mi-body">
          <div class="form-row"> 
            ${App.generateFormInput({ label: 'Name', name: 'name', value: App.settings.name })}
            ${App.generateFormInput({ label: 'Number', name: 'number', value: App.settings.number, disabled: true })}
          </div>
          <div class="form-row"> 
            ${App.generateFormInput({ label: 'Street', name: 'street', value: App.settings.address.street })}
            ${App.generateFormInput({ label: 'City', name: 'city', value: App.settings.address.city })}
            ${App.generateFormInput({ label: 'Zip', name: 'zip', value: App.settings.address.zip })}
            ${App.generateFormInput({ label: 'Country', name: 'country', value: App.settings.address.country })}
          </div>
          ${App.generateFormSelect({label: 'Currency', name: 'currency', value: App.settings.currency.code, options: currencyOptions })} 
          <div class="mi-control">
            <button class="btn btn-primary btn-raised mi-btn">Save</button>
          </div>
        </div>
      </form>
      <form class="mod-item">
        <div class="mi-header">Timers</div>
        <div class="mi-body">
          <div class="form-row"> 
            ${App.generateFormInput({ type: 'number', step: 1000, label: 'Activity Check Timeout (ms)', name: 'activityCheckTimeout', value: App.settings.activityCheckTimeout })}
            ${App.generateFormInput({ type: 'number', step: 1000, label: 'Activity Timeout (ms)', name: 'activityTimeout', value: App.settings.activityTimeout })}
            ${App.generateFormInput({ type: 'number', step: 1000, label: 'Carousel Interval (ms)', name: 'carouselInterval', value: App.settings.carouselInterval })}
          </div>
          <div class="mi-control">
            <button class="btn btn-primary btn-raised mi-btn">Save</button>
          </div>
        </div>
      </form>
    </div>
  `);
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};

