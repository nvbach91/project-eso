const progress = `
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
`;
const slides = [
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg09_hjz6no', btn: "Touch to start" }, 
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg10_coyfml', btn: "Touch to start" },
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg07_wrsdxe', btn: "Touch to start" },
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg04_i3fq68', btn: "Touch to start" },
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg06_gmmeqj', btn: "Touch to start" },
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg01_mog1lh', btn: "Touch to start" },
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg05_osoyo0', btn: "Touch to start" },
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg02_komziq', btn: "Touch to start" },
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg03_tdlabn', btn: "Touch to start" },
  { img: 'https://res.cloudinary.com/ceny24/image/upload/bg08_hsajsa', btn: "Touch to start" },
];
App.renderStandbyScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="container-fluid px-0">
        <div id="standby-carousel" class="carousel slide" data-ride="carousel">
          <ol class="carousel-indicators">
            ${slides.map((slide, index) => {
              return `<li data-target="#standby-carousel" data-slide-to="${index}" ${index === App.currentSlidePosition ? ' class="active"' : ''}></li>`
            }).join('')}
          </ol>
          <div class="carousel-inner bg-info" role="listbox">
            ${slides.map(({img, btn}, index) => {
              return `
                <div class="carousel-item${index === App.currentSlidePosition ? ' active' : ''}">
                  <div class="d-flex align-items-center justify-content-center min-vh-100"${App.getBackgroundImage(img)}>
                    <button class="btn btn-primary btn-raised btn-lg btn-xlg">${btn}</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </main>
  `);
  screen.find('.carousel-item').click(() => {
    App.renderDeliveryMethodScreen();
  });
  App.bindCarousel(screen.find('#standby-carousel'));
  screen.hide();
  App.jLocaleSwitcher.fadeIn();
  App.jBackButton.fadeOut();
  App.jDeliveryMethodIndicator.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn();
};