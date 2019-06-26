App.generateFormInput = (args) => {
  const { label, name, value, required, disabled } = args;
  return `
    <div class="form-group">
        <label>${label}</label>
        <input class="form-control" name="${name}" value="${value}"${required && ' required'} ${disabled && ' readonly'}>
    </div>
  `;
};