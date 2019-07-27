App.generateFormInput = (args) => {
  const { label, name, value, required, disabled, type, step } = args;
  return `
    <div class="form-group">
      <label>${label}</label>
      <input
        ${type ? ` type="${type}"` : ''}
        ${step ? ` step="${step}"` : ''}
        class="form-control"
        name="${name}"
        value="${value}"
        ${required ? ' required' : ''}
        ${disabled ? ' readonly' : ''}>
    </div>
  `;
};
