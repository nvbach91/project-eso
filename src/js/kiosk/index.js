require('./App.js');

$(document).ready(() => {
  $('body').bootstrapMaterialDesign();
  //document.addEventListener('contextmenu', event => event.preventDefault());
  App.init();
});
