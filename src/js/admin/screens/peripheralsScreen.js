const generatePrinterSettingsDropdown = (type, id) => `
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" title="${id}">
      ${App.getIcon('settings')}
    </button>
    <div class="dropdown-menu">
      <button class="dropdown-item btn btn-info" data-action="duplicate-printer" data-type="${type}" data-id="${id}" type="button">${App.lang.misc_duplicate}</button>
      <button class="dropdown-item btn btn-danger" data-action="delete-printer" data-type="${type}" data-id="${id}" type="button">${App.lang.misc_delete}</button>
    </div>
  </div>
`;

const renderKioskPrinterSettings = (type, printer, id) => {
  const printerOptions = App.supportedPrinters.map((p) => ({ label: p, value: p }));
  return `
    <div class="printer">
      <div class="form-row">
        ${App.generateFormSelect({ name: `${type}.${id}.name`, value: printer.name, options: printerOptions, optional: true })}
        ${App.generateFormInput({ name: `${type}.${id}.ip`, value: printer.ip, width: 140, optional: true, pattern: App.regex.ip.regex })}
        ${App.generateFormInput({ name: `${type}.${id}.groups`, value: printer.groups, width: 140, optional: true, pattern: /^\d+(,\d+)*$/ })}
      </div>
      <div class="form-row">
        ${App.generateFormSelect({ name: `${type}.${id}.diacritics`, value: printer.diacritics, options: App.binarySelectOptions, width: 80 })}
        ${App.generateFormSelect({ name: `${type}.${id}.direct`, value: printer.direct, options: App.binarySelectOptions, width: 80 })}
        ${App.generateFormInput({ name: `${type}.${id}.columns`, value: printer.columns, type: 'number', width: 80, min: 24, max: 48 })}
        ${App.generateFormSelect({ name: `${type}.${id}.style`, value: printer.style, width: 120, options: App.printerStyleOptions })}
        ${generatePrinterSettingsDropdown(type, id)}
      </div>
    </div>
  `;
};

const renderKitchenPrinterSettings = (type, printer, id) => {
  const printerOptions = App.supportedPrinters.map((p) => ({ label: p, value: p }));
  return `
    <div class="printer">
      <div class="form-row">
        ${App.generateFormInput({ name: `${type}.${id}.name`, value: printer.name, optional: true })}
        ${App.generateFormInput({ name: `${type}.${id}.ip`, value: printer.ip, width: 140, optional: true, pattern: App.regex.ip.regex })}
        ${App.generateFormInput({ name: `${type}.${id}.groups`, value: printer.groups, width: 140, optional: true, pattern: /^\d+(,\d+)*$/ })}
      </div>
      <div class="form-row">
        ${App.generateFormSelect({ name: `${type}.${id}.diacritics`, value: printer.diacritics, options: App.binarySelectOptions, width: 80 })}
        ${App.generateFormSelect({ name: `${type}.${id}.direct`, value: printer.direct, options: App.binarySelectOptions, width: 80 })}
        ${App.generateFormInput({ name: `${type}.${id}.columns`, value: printer.columns, type: 'number', width: 80, min: 24, max: 48 })}
        ${App.generateFormSelect({ name: `${type}.${id}.style`, value: printer.style, width: 120, options: App.printerStyleOptions })}
        ${generatePrinterSettingsDropdown(type, id)}
      </div>
    </div>
  `;
};

const renderLabelPrinterSettings = (type, printer, id) => `
  <div class="printer">
    <div class="form-row">
      ${App.generateFormInput({ name: `${type}.${id}.name`, value: printer.name, optional: true })}
      ${App.generateFormInput({ name: `${type}.${id}.ip`, value: printer.ip, width: 140, optional: true, pattern: App.regex.ip.regex })}
      ${App.generateFormInput({ name: `${type}.${id}.groups`, value: printer.groups, width: 140, optional: true, pattern: /^\d+(,\d+)*$/ })}
    </div>
    <div class="form-row">
      ${App.generateFormSelect({ name: `${type}.${id}.diacritics`, value: printer.diacritics, options: App.binarySelectOptions, width: 80 })}
      ${App.generateFormSelect({ name: `${type}.${id}.direct`, value: printer.direct, options: App.binarySelectOptions, width: 80 })}
      ${App.generateFormInput({ name: `${type}.${id}.columns`, value: printer.columns, type: 'number', width: 80, min: 24, max: 48 })}
    </div>
    <div class="form-row">
      ${App.generateFormInput({ name: `${type}.${id}.top`, value: printer.top, type: 'number', width: 80, min: 0, optional: true })}
      ${App.generateFormInput({ name: `${type}.${id}.left`, value: printer.left, type: 'number', width: 80, min: 0, optional: true })}
      ${App.generateFormInput({ name: `${type}.${id}.fontSize`, value: printer.fontSize, type: 'number', width: 80, min: 8, optional: true })}
      ${App.generateFormSelect({ name: `${type}.${id}.style`, value: printer.style, width: 120, options: App.printerStyleOptions })}
    </div>
    <div class="form-row">
      ${App.generateFormInput({ name: `${type}.${id}.pageWidth`, value: printer.pageWidth, type: 'number', width: 80, min: 0, optional: true })}
      ${App.generateFormInput({ name: `${type}.${id}.pageHeight`, value: printer.pageHeight, type: 'number', width: 80, min: 0, optional: true })}
    </div>
  </div>
`;

const renderPrinterSettings = (type, id) => {
  const printer = App.settings[type][id];
  if (type === 'kioskPrinters') {
    return renderKioskPrinterSettings(type, printer, id);
  }
  if (type === 'kitchenPrinters') {
    return renderKitchenPrinterSettings(type, printer, id);
  }
  if (type === 'labelPrinters') {
    return renderLabelPrinterSettings(type, printer, id);
  }
};

const duplicatePrinter = function () {
  const t = $(this);
  const id = t.data('id');
  const type = t.data('type');
  const printers = App.settings[type];
  const printerToDuplicate = JSON.parse(JSON.stringify(printers[id]));
  const newId = App.generateRandomPassword();
  printers[newId] = printerToDuplicate;
  const newPrinterCard = $(renderPrinterSettings(type, newId));
  newPrinterCard.find('button[data-action="duplicate-printer"]').click(duplicatePrinter);
  newPrinterCard.find('button[data-action="delete-printer"]').click(deletePrinter);
  t.parents('.card.printer').after(newPrinterCard);
  t.parents('form').submit();
};

const deletePrinter = function () {
  const t = $(this);
  const type = t.data('type');
  const printers = App.settings[type];
  if (Object.keys(printers).length === 1) {
    return App.showWarning('Delete the printer name instead');
  }
  const id = t.data('id');
  App.deletePrinter(id, t, type);
};

App.renderPeripheralsScreen = () => {
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_peripherals}</div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  const cpBody = $(`<div class="card-body"></div>`);
  const printerForm = $(`
    <form class="mod-item card">
      <div class="mi-header">${App.lang.settings_printer}</div>
      <div class="mi-body">
        <ul class="nav nav-tabs" role="tablist">
          ${['kioskPrinters', 'kitchenPrinters', 'labelPrinters'].map((type, index) => `
            <li class="nav-item" role="presentation">
              <button type="button" class="nav-link${index === 0 ? ' active' : ''}" role="tab" data-toggle="tab" data-target="#${type}">${App.lang[`form_${type}`]}</button>
            </li>
          `).join('')}
        </ul>
        <div class="tab-content">
          ${['kioskPrinters', 'kitchenPrinters', 'labelPrinters'].map((type, index) => `
            <div class="tab-pane fade${index === 0 ? ' show active' : ''}" role="tabpabnel" id="${type}">
              ${Object.keys(App.settings[type]).map((id) => renderPrinterSettings(type, id)).join('')}
            </div>
          `).join('')}
        </div>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(printerForm, '/settings');

  printerForm.find('button[data-action="duplicate-printer"]').click(duplicatePrinter);
  printerForm.find('button[data-action="delete-printer"]').click(deletePrinter);

  const paymentTerminalOptions = [];
  const paymentTerminalKeys = Object.keys(App.supportedPaymentTerminals);
  if (!paymentTerminalKeys.length) {
    paymentTerminalOptions.push({ label: 'You need to install OPS v9.1.2 or later', value: '' });
  }
  paymentTerminalKeys.forEach((type) => {
    paymentTerminalOptions.push({ label: App.supportedPaymentTerminals[type].name, value: type });
  });

  const paymentTerminalForm = $(`
    <form class="mod-item card">
      <div class="mi-header">${App.lang.settings_payment_terminal}</div>
      <div class="mi-body">
        <div class="form-row"> 
          ${App.generateFormSelect({ name: 'terminal.type', options: paymentTerminalOptions, value: App.settings.terminal.type })}
          ${App.generateFormInput({ name: 'terminal.id', value: App.settings.terminal.id })}
        </div>
        <div class="form-row">
          ${App.generateFormInput({ name: 'terminal.ip', value: App.settings.terminal.ip })}
          ${App.generateFormInput({ name: 'terminal.port', min: 1024, max: 65535, value: App.settings.terminal.port, type: 'number', disabled: true })}
          ${App.generateFormSelect({ name: 'terminal.partial_approval', options: App.binarySelectOptions, value: App.settings.terminal.partial_approval })}
        </div>
        <div class="form-row">
          ${App.generateFormInput({ name: 'terminal.endpoint', value: App.settings.terminal.endpoint, disabled: true })}
          ${App.generateFormInput({ name: 'terminal.password', value: App.settings.terminal.password, type: 'password' })}
        </div>
        <div class="mi-control">
          <a class="btn btn-info" target="_blank" href="${App.paymentTerminalServerURL}/transactions?auth=${App.settings.terminal.password}">
            Transactions ${App.getIcon('open_in_new')}
          </a>
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(paymentTerminalForm, '/settings');
  const portInput = paymentTerminalForm.find('input[name="terminal.port"]');
  paymentTerminalForm.find('select[name="terminal.type"]').change(function () {
    const t = $(this);
    portInput.val(App.supportedPaymentTerminals[t.val()].port);
  });
  const tablesyncUrlOptions = [
    { label: App.lang.misc_inactive, value: '' },
    { label: 'https://sync.vcap.me:2443', value: 'https://sync.vcap.me:2443' },
  ];
  const tablesyncSettingsForm = $(`
    <form class="mod-item card">
      <div class="mi-header">${App.lang.settings_tablesync}</div>
      <div class="mi-body">
        <p>
          ${App.lang.tip_tablesync_sync}
        </p>
        <p>
          <a class="btn btn-info" target="_blank" href="https://bit.ly/gokasa-table-sync">
            ${App.lang.misc_instructions}: Gokasa Table Sync ${App.getIcon('open_in_new')}
          </a>
          <a class="btn btn-info" target="_blank" href="https://bit.ly/gokasa-quantum">
            ${App.lang.misc_instructions}: Gokasa Quantum ${App.getIcon('open_in_new')}
          </a>
        </p>
        <div class="form-row">
          ${App.generateFormSelect({ name: 'tablesync.url', value: App.settings.tablesync.url, optional: true, options: tablesyncUrlOptions })}
          ${App.generateFormInput({ name: 'tablesync.ip', value: App.settings.tablesync.ip, optional: true, pattern: App.regex.ip.regex, disabled: true })}
        </div>
        <small class="form-text">${App.lang.tip_tablesync_sync_url}</small>
        <small class="form-text">${App.lang.tip_tablesync_sync_url_2}</small>
        <div class="mi-control">
          <button class="btn btn-primary btn-raised btn-save">${App.lang.misc_save} ${App.getIcon('save')}</button>
        </div>
      </div>
    </form>
  `).appendTo(cpBody);
  App.bindForm(tablesyncSettingsForm, '/settings');

  App.jControlPanelBody.replaceWith(cpBody);
  App.jControlPanelBody = cpBody;
};
