// formats a number to a price string, e.g. 5.00
Number.prototype.formatMoney = function (c, d, t) {
  //d = App.settings.decimal_delimiter;
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d === undefined ? "." : d,
    t = t === undefined ? "" : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  var retval = s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  if (retval === "-0.00") {
    retval = "0.00";
  }
  return retval;
};

App.showInModal = (element, title) => {
  App.jModal.find('.modal-title').text(title || '');
  App.jModal.find('.modal-body').empty().append(element);
  App.jModal.modal();
};
