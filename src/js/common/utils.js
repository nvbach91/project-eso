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

App.round = (value, decimals) => {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

App.showInModal = (element, title) => {
  App.jModal.find('.modal-title').text(title || '');
  App.jModal.find('.modal-body').empty().append(element);
  App.jModal.modal();
};

App.bindCarousel = (carousel) => {
  carousel.carousel({ interval: App.settings.carouselInterval });
  carousel.on('touchstart', (event) => {
    const xClick = event.originalEvent.touches[0].pageX;
    carousel.one('touchmove', (event) => {
      const xMove = event.originalEvent.touches[0].pageX;
      if (Math.floor(xClick - xMove) > 5) {
        carousel.carousel('next');
      }
      else if (Math.floor(xClick - xMove) < -5) {
        carousel.carousel('prev');
      }
    });
    carousel.on('touchend', () => {
      carousel.off('touchmove');
    });
  });
  carousel.on('slide.bs.carousel', (e) => {
    App.currentSlidePosition = e.to;
  });
};

App.showSpinner = () => {
  App.jSpinner.show();
};

App.hideSpinner = () => {
  App.jSpinner.hide();
};

App.fetchJoke = () => {
  return $.get('https://geek-jokes.sameerkumar.website/api');
};

App.reset = () => {
  App.cart = {};
  App.cartCategoryQuantities = {};
  App.activeTabPosition = 0;
  //console.log('Activity session ended');
  clearInterval(App.activityCheckInterval);
  App.activityCheckInterval = 0;
  App.isCheckingActivity = false;
  App.saveLocalCart();
  App.calculateCart();
  App.jCheckoutButton.fadeOut();
  App.jOrderPreview.remove();
  App.renderStandbyScreen();
};

// start the session
// each 5 seconds check if the idle time is greater than the timeout
//   if yes then show the activity check dialog
//   if the app is idle for more seconds (based on the value in the settings) reset the app
//   if the app becomes active (someone clicks on the screen) while the activity check dialog is off, the idle time is reset
// 
App.startActivitySession = () => {
  if (App.activityCheckInterval) {
    return false;
  }
  //console.log('Activity session started');
  App.activityCheckInterval = setInterval(() => {
    const idleTime = new Date() - App.lastActivityTime;
    //console.log('idle time = ' + idleTime);
    if (idleTime > App.settings.activityTimeout && !App.isCheckingActivity) {
      //console.log('checking activity');
      App.checkActivity();
    }
    if (idleTime > App.settings.activityTimeout + App.settings.activityCheckTimeout) {
      App.closeModal();
      App.reset();
    }
  }, 1000);
};

$(window).click(() => {
  if (App.activityCheckInterval) {
    App.lastActivityTime = new Date();
    //console.log('refreshing activity: last activity = ' + App.lastActivityTime.getSeconds());
  }
});

App.checkActivity = () => {
  App.isCheckingActivity = true;
  const check = $(`
    <div class="activity-check">
      <p>${App.lang.modal_timeout_text}</p>
      <div class="ac-control">
        <button class="btn btn-danger">${App.lang.modal_timeout_leave_btn}</button>
        <button class="btn btn-primary btn-raised">${App.lang.modal_timeout_stay_btn}</button>
      </div>
    </div>
  `);
  App.showInModal(check, App.lang.modal_timeout_title);
  App.jModal.find('.cs-cancel').remove();
  App.jModal.on('hidden.bs.modal', () => {
    App.isCheckingActivity = false;
    App.jModal.off('hidden.bs.modal');
  });
  check.find('.btn-danger').click((e) => {
    e.stopPropagation();
    App.closeModal();
    App.reset();
  });

  check.find('.btn-primary').click(() => {
    App.closeModal();
  });
};

App.closeModal = () => {
  if (App.jModal.is(':visible')) {
    App.jModal.modal('toggle');
  }
};

App.showWarning = (msg) => {
  const warning = $(`<p>${msg}</p>`);
  App.jModal.find('.cs-cancel').remove();
  App.showInModal(warning, App.lang.modal_payment_failed_title);
};

App.createInlineSpinner = () => {
  return $(`
    <div class="spinner-inline">
      <div class="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `);
};

App.printDirect = (msg, printer) => {
  const destination = printer || App.settings.printer;
  if (!destination) {
    return false;
  }
  $.post({
    url: App.localhostServerURL + '/printdirect',
    data: {
      printer: destination,
      content: msg
    }
  });
};;

App.calculateTaxFromPrice = (price, vatRate) => {
  return price / (100 + vatRate) * vatRate;
};

App.getClerk = (username) => {
  return App.settings.employees[username];
};

App.addPadding = (value, maxLength) => {
  let v = value.toString();
  while (v.length < maxLength) {
    v = ' ' + v;
  }
  return v;
};

// the actual ESCPOS commands are part of OPS Peripherals
// where these szmbols are replaced with buffers
App.ESCPOS = {
  bold: (s) => {
    return '{' + s + '}';
  },
  doubleHeight: (s) => {
    return '`' + s + '´';
  },
  quadrupleSize: (s) => {
    return '^' + s + 'ˇ';
  },
  invert: (s) => {
    return '\x1d\x421' + s + '\x1d\x420';
  },
};

App.getPaymentMethod = (code) => {
  return App.lang['payment_method_' + code];
};

App.loadLocale = () => {
  App.lang = App['GLocale' + App.locale.toUpperCase()] || App.GLocaleEN;
};

App.printQRCode = (data) => {
  const qrcodeContainer = $('<div>');
  qrcodeContainer.qrcode(data.toString());
  $.post({
    url: 'https://localhost:2443/printdirectimage',
    data: {
      image: qrcodeContainer.find('canvas')[0].toDataURL(), 
      cut: true,
    }
  });
};

App.getNumeralForm = (key, n) => {
  return n === 1 ? App.lang[key] : n > 4 || n === 0 ? App.lang[key + 'ss'] : App.lang[key + 's'];
};

App.detectBrowserLanguage = () => {
  for (const key in App.supportedLocales) {
    if (navigator.language === key || navigator.language.startsWith(key)) {
      return key;
    }
  }
  return 'en';
};

App.nextTab = () => {
  setTimeout(() => {
    const nextTab = App.jTabs.children().eq(App.activeTabPosition + 1);
    if (nextTab.length) {
      nextTab.click();
      App.jTabs.animate({
        scrollTop: nextTab.offset().top
      }, App.getAnimationTime());
    }
  }, App.getAnimationTime());
};

App.preloadImages = (images) => {
  Array.from(new Set(images)).forEach((image) => {
    new Image().src = App.imageUrlBase + image;
  });
};

App.getAnimationTime = () => {
  return window.innerWidth >= 720 ? 300 : 0;
};

App.renderSpinner = () => {
  const spinner = $(`
    <div id="spinner">
      <div class="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `);
  App.jSpinner.replaceWith(spinner);
  App.jSpinner = spinner;
  App.jSpinner.hide();
};

App.renderModal = () => {
  const modal = $(`
    <div id="modal" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
            <button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close" data-dismiss="modal">${App.lang.misc_close_btn}</button>
          </div>
        </div>
      </div>
    </div>
  `);
  App.jModal.replaceWith(modal);
  App.jModal = modal;
};

App.getLastTransaction = () => {
  return App.transactions[App.transactions.length - 1];
};

App.calculateTransactionTotal = (items) => {
  let totalPrice = 0;
  items.forEach((item) => {
    let itemPrice = item.quantity * item.price;
    itemPrice = itemPrice - itemPrice * (item.discount || 0) / 100;
    totalPrice += itemPrice;
  });
  return totalPrice;
};