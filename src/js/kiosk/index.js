require('./App.js');

$(document).ready(() => {
  $('body').bootstrapMaterialDesign();
  if (!location.origin.includes('vcap.me:')) {
    document.addEventListener('contextmenu', event => event.preventDefault());
  }
  App.init();
});
