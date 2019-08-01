App.generateFormInput = (args) => {
  const { label, name, value, optional, disabled, type, step, width, min, max } = args;
  return `
    <div class="form-group"${width ? ` style="max-width: ${width}px"` : ''}>
      <label>${label}</label>
      <input
        ${type ? ` type="${type}"` : ''}
        ${step ? ` step="${step}"` : ''}
        ${min ? ` min="${min}"` : ''}
        ${max ? ` max="${max}"` : ''}
        class="form-control"
        name="${name}"
        value="${value}"
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
