App.renderPeripheralsScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Peripherals</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const printerOptions = App.supportedPrinters.map((printer) => ({ label: printer, value: printer }));
  const cpBody = $(`
    <div class="card-body">
      <form class="mod-item">
        <div class="mi-header">Printer</div>
        <div class="mi-body">
          <div class="form-row"> 
            ${App.generateFormSelect({ label: 'Printer name', name: 'name', value: App.settings.printer.name, options: printerOptions })}
            ${App.generateFormSelect({ label: 'Print diacritics', name: 'diacritics', value: App.settings.printer.diacritics, options: App.binarySelectOptions })}
            ${App.generateFormInput({ label: 'Print columns', name: 'columns', value: App.settings.printer.columns, type: 'number', width: 80, min: 32, max: 48 })}
          </div>
          <div class="mi-control">
            <button class="btn btn-primary btn-raised mi-btn">Save</button>
          </div>
        </div>
      </form>
      <form class="mod-item">
        <div class="mi-header">Payment terminal</div>
        <div class="mi-body">
          <div class="form-row"> 
            ${App.generateFormInput({ label: 'Endpoint', name: 'endpoint', value: App.settings.terminal.endpoint, disabled: true })}
            ${App.generateFormInput({ label: 'IP Address', name: 'ip', value: App.settings.terminal.ip })}
            ${App.generateFormInput({ label: 'Port', name: 'port', value: App.settings.terminal.port })}
          </div>
          <div class="form-row"> 
            ${App.generateFormInput({ type: 'password', label: 'Password', name: 'password', value: App.settings.terminal.password })}
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
