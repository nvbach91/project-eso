require('./App');

$(document).ready(() => {
  $('body').bootstrapMaterialDesign();
  //document.addEventListener('contextmenu', event => event.preventDefault());
  App.init();
});
