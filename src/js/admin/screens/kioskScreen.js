const currencies = {
  CZK: {
    symbol: 'Kč',
  },
  EURO: {
    symbol: '€',
  }
}

App.renderKioskScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Kiosk</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`
  <div>
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5>Manage kiosk</h5>
    </div>
    <form class="mod-item">
      <div class="mi-header">Settings</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Name', name: 'name', value: '' })}
          ${App.generateFormInput({ label: 'Number', name: 'number', value: App.settings.number || 0 , disabled: true })}
        </div>
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Street', name: 'street', value: App.settings.address.street || '' })}
          ${App.generateFormInput({ label: 'City', name: 'city', value: App.settings.address.city || '' })}
          ${App.generateFormInput({ label: 'Zip', name: 'zip', value: App.settings.address.zip || '' })}
          ${App.generateFormInput({ label: 'Country', name: 'country', value: App.settings.address.country || '' })}
        </div>
        ${App.generateCurrencySelect(App.settings.currency.code)} 
        <div class="mi-control">
          <button id="save-settings" class="btn btn-primary btn-raised mi-btn">Save</button>
        </div>
      </div>
    </form>
    <form class="mod-item">
      <div class="mi-header">Timers</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Activity Check Timeout', name: 'activityCheckTimeout', value: App.settings.activityCheckTimeout || 0 })}
          ${App.generateFormInput({ label: 'Activity Timeout', name: 'activityTimeout', value: App.settings.activityTimeout || 0 })}
          ${App.generateFormInput({ label: 'Carousel Interval', name: 'carouselInterval', value: App.settings.carouselInterval || 0 })}
        </div>
        <div class="mi-control">
          <button id="save-timers" class="btn btn-primary btn-raised mi-btn">Save</button>
        </div>
      </div>
    </form>
  </div>
  `);
  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
}

App.generateCurrencySelect = (selected) => {
  return `
    <div class="form-group">
      <label>Currency</label>
      <select class="custom-select" name="currency" required>
        <option></option>
        ${Object.keys(currencies).map((currency) => {
          const { symbol } = currencies[currency];
          return `<option value="${currency}"${selected == currency ? ' selected' : ''}>${currency} - ${symbol}</option>`;
        }).join('')}
      </select>
    </div>
  `;
};