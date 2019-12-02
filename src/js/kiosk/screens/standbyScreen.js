const progress = `
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
`;
const slides = [
  { img: `${App.imageUrlBase}bg09_hjz6no-min_sgc2il`, btn: "Touch to start" }, 
  { img: `${App.imageUrlBase}bg10_coyfml-min_fcywew`, btn: "Touch to start" },
  { img: `${App.imageUrlBase}bg01_mog1lh-min_fbiyp4`, btn: "Touch to start" },
  { img: `${App.imageUrlBase}bg05_osoyo0-min_l20vdt`, btn: "Touch to start" },
  { img: `${App.imageUrlBase}bg04_i3fq68-min_ezecgd`, btn: "Touch to start" },
  { img: `${App.imageUrlBase}bg08_hsajsa-min_rcwj9g`, btn: "Touch to start" },
  { img: `${App.imageUrlBase}bg02_komziq-min_js6pl0`, btn: "Touch to start" },
  { img: `${App.imageUrlBase}bg03_tdlabn-min_xwllb6`, btn: "Touch to start" },
  { img: `${App.imageUrlBase}bg07_wrsdxe-min_vi4wot`, btn: "Touch to start" },
  { img: `${App.imageUrlBase}bg06_gmmeqj-min_nsxd6e`, btn: "Touch to start" },
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