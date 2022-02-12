App.renderPeripheralsScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_peripherals}</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const printerOptions = App.supportedPrinters.map((printer) => ({ label: printer, value: printer }));
  const cpBody = $(`<div class="card-body"></div>`);
  const printerForm = $(`
    <form class="mod-item card">
      <div class="mi-header">${App.lang.settings_printer}</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormSelect({ name: 'printer.name', value: App.settings.printer.name, options: printerOptions })}
          ${App.generateFormInput({ name: 'printer.ip', value: App.settings.printer.ip, width: 140, optional: true, pattern: App.regex.ip.regex })}
          ${App.generateFormInput({ name: 'printer.groups', value: App.settings.printer.groups, width: 120, optional: true, pattern: /^\d+(,\d+)*$/ })}
          ${App.generateFormSelect({ name: 'printer.diacritics', value: App.settings.printer.diacritics, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormSelect({ name: 'printer.direct', value: App.settings.printer.direct, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormInput({ name: 'printer.columns', value: App.settings.printer.columns, type: 'number', width: 80, min: 24, max: 48 })}
        </div>
        <div class="form-row"> 
          ${App.generateFormSelect({ name: 'kitchenPrinter.name', value: App.settings.kitchenPrinter.name, options: printerOptions, optional: true })}
          ${App.generateFormInput({ name: 'kitchenPrinter.ip', value: App.settings.kitchenPrinter.ip, width: 140, optional: true, pattern: App.regex.ip.regex })}
          ${App.generateFormInput({ name: 'kitchenPrinter.groups', value: App.settings.kitchenPrinter.groups, width: 120, optional: true, pattern: /^\d+(,\d+)*$/ })}
          ${App.generateFormSelect({ name: 'kitchenPrinter.diacritics', value: App.settings.kitchenPrinter.diacritics, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormSelect({ name: 'kitchenPrinter.direct', value: App.settings.kitchenPrinter.direct, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormInput({ name: 'kitchenPrinter.columns', value: App.settings.kitchenPrinter.columns, type: 'number', width: 80, min: 32, max: 48 })}
        </div>
        <div class="form-row">
          ${App.generateFormInput({ name: 'labelPrinter.name', value: App.settings.labelPrinter.name, optional: true })}
          ${App.generateFormInput({ name: 'labelPrinter.ip', value: App.settings.labelPrinter.ip, width: 140, optional: true, pattern: App.regex.ip.regex })}
          ${App.generateFormInput({ name: 'labelPrinter.groups', value: App.settings.labelPrinter.groups, width: 120, optional: true, pattern: /^\d+(,\d+)*$/ })}
          ${App.generateFormSelect({ name: 'labelPrinter.diacritics', value: App.settings.labelPrinter.diacritics, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormSelect({ name: 'labelPrinter.direct', value: App.settings.labelPrinter.direct, options: App.binarySelectOptions, width: 80 })}
          ${App.generateFormInput({ name: 'labelPrinter.columns', value: App.settings.labelPrinter.columns, type: 'number', width: 80, min: 32, max: 48 })}
          ${App.generateFormInput({ name: 'labelPrinter.top', value: App.settings.labelPrinter.top, type: 'number', width: 80, min: 0, optional: true })}
          ${App.generateFormInput({ name: 'labelPrinter.left', value: App.settings.labelPrinter.left, type: 'number', width: 80, min: 0, optional: true })}
          ${App.generateFormInput({ name: 'labelPrinter.fontSize', value: App.settings.labelPrinter.fontSize, type: 'number', width: 80, min: 8, optional: true })}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(printerForm, '/settings');

  const paymentTerminalForm = $(`
    <form class="mod-item card">
      <div class="mi-header">${App.lang.settings_payment_terminal}</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormInput({ name: 'terminal.endpoint', value: App.settings.terminal.endpoint, disabled: true })}
          ${App.generateFormInput({ name: 'terminal.id', value: App.settings.terminal.id })}
        </div>
        <div class="form-row">
          ${App.generateFormInput({ name: 'terminal.ip', value: App.settings.terminal.ip })}
          ${App.generateFormInput({ name: 'terminal.port', value: App.settings.terminal.port, type: 'number' })}
        </div>
        <div class="form-row">
          ${App.generateFormInput({ name: 'terminal.password', value: App.settings.terminal.password })}
        </div>
        <div class="mi-control">
          <a class="btn btn-info" target="_blank" href="${App.paymentTerminalServerURL}/transactions?auth=${App.settings.terminal.password}">Transactions ${App.getIcon('open_in_new')}</a>
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(paymentTerminalForm, '/settings');

  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};
