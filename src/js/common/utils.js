// formats a number to a price string, e.g. 5.00
Number.prototype.formatMoney = function (c, d, t) {
  //d = App.settings.decimal_delimiter;
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d === undefined ? '.' : d,
    t = t === undefined ? '' : t,
    s = n < 0 ? '-' : '',
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
    j = (j = i.length) > 3 ? j % 3 : 0;
  var retval = s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
  if (retval === '-0.00') {
    retval = '0.00';
  }
  return retval;
};

App.round = (value, decimals) => {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

App.showInModal = (element, title, cb) => {
  App.jModal.find('.modal-title').text(title || '');
  App.jModal.find('.modal-body').empty().append(element);
  App.jModal.modal();
  App.jModal.on('shown.bs.modal', () => {
    cb && cb();
    App.jModal.off('shown.bs.modal');
  });
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

// App.fetchJoke = () => {
//   return $.get('https://geek-jokes.sameerkumar.website/api');
// };

App.reset = () => {
  App.cart = {};
  App.cartCategoryQuantities = {};
  App.activeTabPosition = 0;
  //console.log('Activity session ended');
  clearInterval(App.activityCheckInterval);
  App.activityCheckInterval = 0;
  App.isCheckingActivity = false;
  App.tableMarkerValue = '';
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
  App.showInModal(warning, App.lang.modal_info);
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

App.printDirect = (args) => {
  if (!args) {
    return false;
  }
  if (!args.printer && !args.ip) {
    return false;
  }
  $.post({
    url: App.localhostServerURL + '/printdirect',
    data: args
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
  return App.lang[`payment_method_${code}`];
};

App.getDeliveryMethod = (code) => {
  return App.lang[`delivery_method_${code}`];
};

App.loadLocale = () => {
  App.lang = JSON.parse(JSON.stringify(App['GLocale' + App.locale.toUpperCase()] || App.GLocaleEN));
  if (App.settings.currency) {
    const currencyLocaleLangKeys = [
      'receipt_header_order',
      'receipt_header_tin',
      'receipt_header_vat',
      'receipt_header_residence',
      'receipt_header_premise',
      'receipt_body_vat_invoice',
      'receipt_body_invoice',
      'receipt_payment_total',
      'receipt_payment_method',
      'receipt_payment_tendered',
      'receipt_payment_change',
      'receipt_summary_rates',
      'receipt_summary_net',
      'receipt_summary_vat',
      'receipt_summary_pre',
      'receipt_summary_pos',
      'receipt_summary_bkp',
      'receipt_summary_fik',
      'receipt_footer_clerk',
    ];
    currencyLocaleLangKeys.forEach((key) => {
      App.lang[key] = (App['GLocale' + App.settings.currency.locale.toUpperCase()] || App.GLocaleEN)[key];
    });
  }

  App.binarySelectOptions = [
    { label: App.lang.misc_yes, value: true },
    { label: App.lang.misc_no, value: false },
  ];

  App.vatRegisterationOptions = [
    { label: App.lang.misc_registered, value: true, },
    { label: App.lang.misc_not_registered, value: false, },
  ];

  App.themeOptions = [
    { label: 'TEAL', value: 'teal', },
    { label: 'DARK', value: 'dark', },
    { label: 'RED', value: 'red', },
  ];

  App.verticalPositionSelectOptions = [
    { label: App.lang.misc_top, value: 'top' },
    { label: App.lang.misc_middle, value: 'middle' },
    { label: App.lang.misc_bottom, value: 'bottom' },
  ];
};

App.printQRCode = (data) => {
  const qrcodeContainer = $('<div>');
  qrcodeContainer.qrcode(data.toString());
  $.post({
    url: App.localhostServerURL + '/printdirectimage',
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
  if (!App.settings.autoNextTab) {
    return false;
  }
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
    if (image) {
      new Image().src = `${image.startsWith('http') ? '' : App.imageUrlBase}${image}`;
    }
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

App.destroyDatePickers = () => {
  App.datePickerInstances.forEach((p) => p.destroy());
  App.datePickerInstances = [];
};

App.highlightMatchedText = (text, search) => {
  const startMatchIndex = text.toLowerCase().indexOf(search.toLowerCase());
  const displayContent = startMatchIndex >= 0 ? (
    text.slice(0, startMatchIndex) +
    '<span class="match">' + text.slice(startMatchIndex, startMatchIndex + search.length) + '</span>' +
    text.slice(startMatchIndex + search.length)
  ) : text;
  return displayContent;
};

App.debounce = (fn, time) => {
  let timeout;
  return function () {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

App.createDatePicker = ({ field, onSelect, onOpen }) => {
  const picker = new Pikaday({
    firstDay: 1,
    setDefaultDate: true,
    defaultDate: new Date(),
    maxDate: new Date(),
    format: App.formats.date,
    field,
    onSelect,
    onOpen: onOpen ? onOpen : () => { },
  });
  App.datePickerInstances.push(picker);
  return picker;
};

App.bindDatePicker = ({ id, onSelect, onOpen }) => {
  const dateField = App.jControlPanelHeader.find(`#${id}`);
  App.jControlPanelHeader.find(`.datepicker-btn[data-id=${id}]`).click(() => dateField.click());
  return App.createDatePicker({
    field: dateField.get(0),
    onSelect: onSelect,
    onOpen: onOpen ? onOpen : () => { }
  });
};


App.sumObjectValues = (o) => {
  if (!o) return 0;
  const keys = Object.keys(o);
  let sum = 0;
  keys.forEach((key) => {
    const val = o[key];
    if (!isNaN(val)) {
      sum += val;
    }
  });
  return sum;
};

const vi_diaDict = {};
const vi_dia = 'ĂăÂâĐđÊêÔôƠơƯưÀàẰằẦầÈèỀềÌìÒòỒồỜờÙùỪừỲỳẢảẲẳẨẩẺẻỂểỈỉỎỏỔổỞởỦủỬửỶỷÃãẴẵẪẫẼẽỄễĨĩÕõỖỗỠỡŨũỮữỸỹẮắẤấÉéẾếỐốỚớỨứẠạẶặẬậẸẹỆệỊịỌọỘộỢợỤụỰựỴỵ';
const vi_non = 'AaAaDdEeOoOoUuAaAaAaEeEeIiOoOoOoUuUuYyAaAaAaEeEeIiOoOoOoUuUuYyAaAaAaEeEeIiOoOoOoUuUuYyAaAaEeEeOoOoUuAaAaAaEeEeIiOoOoOoUuUuYy';
for (let i = 0; i < vi_dia.length; i++) {
  vi_diaDict[vi_dia[i]] = vi_non[i];
}

App.removeVietnameseDiacritics = (s) => {
  let res = '';
  for (let i = 0; i < s.length; i++) {
    res += vi_diaDict[s[i]] || s[i];
  }
  return res;
};

const diaDict = {};
const dia = 'ěščřžýáíéóúůďťňľäĚŠČŘŽÝÁÍÉÓÚŮĎŤŇĽÄ' + vi_dia;
const non = 'escrzyaieouudtnlaESCRZYAIEOUUDTNLA' + vi_non;
for (let i = 0; i < dia.length; i++) {
  diaDict[dia[i]] = non[i];
}

App.removeDiacritics = (s) => {
  let res = '';
  for (let i = 0; i < s.length; i++) {
    res += diaDict[s[i]] || s[i];
  }
  return res;
};

App.getNumberOfProductsInGroup = (groupNumber) => {
  return App.productCountByGroups[groupNumber] || 0;
};

App.getBackgroundImage = (img) => {
  return img ? ` style="background-image: url(${img.startsWith('http') ? '' : App.imageUrlBase}${img})${img.includes('flaticon') ? ';background-size:75%' : ''}"` : '';
};

App.createLocaleSwitcher = (options) => {
  const switcher = $(`
    <li class="nav-item" id="locale-switcher">
      <div class="btn-group ${options.direction || 'dropup'}">
        ${Object.keys(App.supportedLocales).filter((locale) => locale === App.locale).map((locale) => {
    return `
            <button class="btn locale-button" data-locale="${locale}" data-toggle="dropdown">
              <div class="flag locale-${locale}"></div>
              <span>${App.supportedLocales[locale]}</span>
            </button>
          `;
  }).join('')}
        <div class="dropdown-menu">
          ${Object.keys(App.supportedLocales).filter((locale) => locale !== App.locale).map((locale) => {
    return `
              <button class="btn locale-button" data-locale="${locale}">
                <div class="flag locale-${locale}"></div>
                <span>${App.supportedLocales[locale]}</span>
              </button>
            `;
  }).join('')}
        </div>
      </div>
    </li>
  `);

  const menu = switcher.find('.dropdown-menu');
  const dropdown = switcher.children('.dropup');
  switcher.find('.locale-button').click(function () {
    const t = $(this);
    if (t.parent().hasClass('dropdown-menu')) {
      const selectedLocale = t.data('locale');
      App.saveLocalPreference('locale', selectedLocale);
      App.loadLocale();
      App.render();
    }
    const currentLocaleButton = dropdown.children('.locale-button').removeAttr('data-toggle');
    menu.prepend(currentLocaleButton);

    t.attr({ 'data-toggle': 'dropdown' });
    dropdown.prepend(t);
  });
  return switcher;
};

App.getIcon = (url, size) => {
  if (/^(\/|http)/.test(url)) {
    return `<i class="icon" style="background-image: url(${url}); width: ${size}px; height: ${size}px;"></i>`;
  }
  return `<i class="material-icons" ${size ? ` style="font-size: ${size}px"` : ''}>${url}</i>`;
};


App.bindToggleButtons = (form, className, iconSize, checkMarkContainerSelector) => {
  form.find(className).click(function () {
    const t = $(this);
    const type = t.data('type');
    const active = t.data('active');
    if (type && type.endsWith('!')) { // mandatory mod (takeout box)
      return false;
    }
    if (type && type.endsWith('.') && active) {
      return false;
    }
    if (type && type.endsWith('.')) {
      const typeButtons = form.find(`${className}[data-type="${type}"]`).removeClass('btn-raised btn-primary').addClass('btn-secondary');
      if (checkMarkContainerSelector) {
        typeButtons.siblings(checkMarkContainerSelector).find('i').remove();
      } else {
        typeButtons.find('i').remove();
      }
      typeButtons.data('active', false);
    }
    t.removeClass(active ? 'btn-raised btn-primary' : 'btn-secondary').addClass(!active ? 'btn-raised btn-primary' : 'btn-secondary');
    t.data('active', !active);
    if (active) {
      if (checkMarkContainerSelector) {
        t.siblings(checkMarkContainerSelector).find('i').remove();
      } else {
        t.find('i').remove();
      }
    } else {
      if (checkMarkContainerSelector) {
        t.siblings(checkMarkContainerSelector).append(App.getIcon('done', iconSize || 14));
      } else {
        t.append(App.getIcon('done', iconSize || 14));
      }
    }
  });
  if (checkMarkContainerSelector) {
    form.find(checkMarkContainerSelector).click(function () {
      $(this).siblings(className).click();
    });
  }
};

App.regex = {
  tin: { regex: /^\d{8}$/, desc: '7-8 digits' },
  ip: { regex: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, desc: 'A valid IPv4 address' },
  url: { regex: /^https:\/\/sync\.vcap\.me:2443$/, desc: 'A valid URL address' },
};

App.generateRandomPassword = (passwordLength) => {
  const digits = '123456789';                 // omitted 0 (looks like o and O)
  const lowercase = 'abcdefghijklmnpqrstuvwxyz'; // omitted o (looks like 0)
  // const uppercase = 'ABCDEFGHIJKLMNPQRSTUVWXYZ'; // omitted O (looks like 0)
  //const special   = '!@#$%*()_+-';
  const allCharSets = [digits, lowercase/*, uppercase*/];//, special];
  let result = '';

  for (let i = 0; i < allCharSets.length; i++) {
    const charSet = allCharSets[i];
    result += charSet[Math.floor(Math.random() * charSet.length)];
  }

  const remainingCharsCnt = (passwordLength || 8) - result.length;
  const allChars = allCharSets.join('');
  for (let i = 0; i < remainingCharsCnt; i++) {
    //result += allChars[Math.floor(Math.random() * (allChars.length - special.length))];
    result += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // shuffle the string
  const a = result.split(''),
    n = a.length;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  result = a.join('');

  return result;
};
