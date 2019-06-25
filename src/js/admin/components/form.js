App.generateFormInput = (args) => {
  const { label, name, value, required } = args;
  return `
    <div class="form-group">
        <label>${label}</label>
        <input class="form-control" name="${name}" value="${value}"${required && ' required'}>
    </div>
  `;
};
App.generateFormDisabledInput = (args) => {
  const { label, name, value } = args;
  return `
    <div class="form-group">
        <label>${label}</label>
        <input class="form-control" name="${name}" value="${value}" readonly>
    </div>
  `;
};