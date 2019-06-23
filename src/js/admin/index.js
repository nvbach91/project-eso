require('./App.js');

$(document).ready(() => {
  $('body').bootstrapMaterialDesign();
  App.configure();
  App.init();
});
