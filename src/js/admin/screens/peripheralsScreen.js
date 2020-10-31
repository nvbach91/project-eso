App.renderPeripheralsScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Peripherals</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const printerOptions = App.supportedPrinters.map((printer) => ({ label: printer, value: printer }));
  const cpBody = $(`<div class="card-body"></div>`);
  const printerForm = $(`
    <form class="mod-item card">
      <div class="mi-header">Printer</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormSelect({ label: 'Kiosk printer name', name: 'printer.name', value: App.settings.printer.name, options: printerOptions })}
          ${App.generateFormInput({ label: 'Print groups', name: 'printer.groups', value: App.settings.printer.groups, width: 120, optional: true, pattern: /^\d+(,\d+)*$/ })}
          ${App.generateFormSelect({ label: 'Diacritics', name: 'printer.diacritics', value: App.settings.printer.diacritics, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormSelect({ label: 'Direct print', name: 'printer.direct', value: App.settings.printer.direct, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormInput({ label: 'Print columns', name: 'printer.columns', value: App.settings.printer.columns, type: 'number', width: 80, min: 32, max: 48 })}
        </div>
        <div class="form-row"> 
          ${App.generateFormSelect({ label: 'Kitchen printer name', name: 'kitchenPrinter.name', value: App.settings.kitchenPrinter.name, options: printerOptions, optional: true })}
          ${App.generateFormInput({ label: 'Print groups', name: 'kitchenPrinter.groups', value: App.settings.kitchenPrinter.groups, width: 120, optional: true, pattern: /^\d+(,\d+)*$/ })}
          ${App.generateFormSelect({ label: 'Diacritics', name: 'kitchenPrinter.diacritics', value: App.settings.kitchenPrinter.diacritics, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormSelect({ label: 'Direct print', name: 'kitchenPrinter.direct', value: App.settings.kitchenPrinter.direct, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormInput({ label: 'Print columns', name: 'kitchenPrinter.columns', value: App.settings.kitchenPrinter.columns, type: 'number', width: 80, min: 32, max: 48 })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(printerForm, '/settings');

  const paymentTerminalForm = $(`
    <form class="mod-item card">
      <div class="mi-header">Payment terminal</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ label: 'Endpoint', name: 'terminal.endpoint', value: App.settings.terminal.endpoint, disabled: true })}
          ${App.generateFormInput({ label: 'Terminal ID', name: 'terminal.id', value: App.settings.terminal.id })}
        </div>
        <div class="form-row">
          ${App.generateFormInput({ label: 'IP Address', name: 'terminal.ip', value: App.settings.terminal.ip })}
          ${App.generateFormInput({ label: 'Port', name: 'terminal.port', value: App.settings.terminal.port, type: 'number' })}
        </div>
        <div class="form-row">
          ${App.generateFormInput({ label: 'Password', name: 'terminal.password', value: App.settings.terminal.password })}
        </div>
        <div class="mi-control">
          <a class="btn btn-info" target="_blank" href="${App.paymentTerminalServerURL}/transactions?auth=${App.settings.terminal.password}">Transactions ${App.getIcon('open_in_new')}</a>
          <button class="btn btn-primary btn-raised btn-save">Save ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(paymentTerminalForm, '/settings');

  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};
