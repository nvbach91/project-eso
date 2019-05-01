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

App.round = function (value, decimals) {
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
    var xClick = event.originalEvent.touches[0].pageX;
    carousel.one('touchmove', (event) => {
      var xMove = event.originalEvent.touches[0].pageX;
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
  carousel.on('slide.bs.carousel', function (e) {
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
  clearInterval(App.activityCheckInterval);
  App.activityCheckInterval = 0;
  App.isCheckingActivity = false;
  App.saveLocalCart();
  App.calculateCart();
  App.jCheckoutButton.fadeOut();
  App.jCartControl.fadeOut();
  App.renderStandbyScreen();
};

// start the session
// each 5 seconds check if the idle time is greater than the timeout
//   if yes then show the activity check dialog
//   if the app is idle for more seconds (based on the value in the settings) reset the app
//   if the app becomes active (someone clicks on the screen) while the activity check dialog is off, the idle time is reset
// 
App.startActivitySession = () => {
  //console.log('starting activity session');
  App.activitySessionStarted = false;
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
      <p>Please let us know you are still here. Otherwise it will go back to the initial screen.</p>
      <div class="ac-control">
        <button class="btn btn-danger">No, I'll leave</button>
        <button class="btn btn-primary btn-raised">Yes, gimme a minute</button>
      </div>
    </div>
  `);
  App.showInModal(check, 'Are you still browsing?');
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