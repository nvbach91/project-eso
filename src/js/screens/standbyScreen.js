const progress = `
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
`;
const slides = [
  {img: 'bg09_hjz6no', btn: "Touch to start" }, 
  {img: 'bg10_coyfml', btn: "Touch to start" },
  {img: 'bg07_wrsdxe', btn: "Touch to start" },
  {img: 'bg04_i3fq68', btn: "Touch to start" },
  {img: 'bg06_gmmeqj', btn: "Touch to start" },
  {img: 'bg01_mog1lh', btn: "Touch to start" },
  {img: 'bg05_osoyo0', btn: "Touch to start" },
  {img: 'bg02_komziq', btn: "Touch to start" },
  {img: 'bg03_tdlabn', btn: "Touch to start" },
  {img: 'bg08_hsajsa', btn: "Touch to start" },
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
              const style = ` style="background-image: url(${App.imageUrlBase}${img})"`;
              return `
                <div class="carousel-item${index === App.currentSlidePosition ? ' active' : ''}">
                  <div class="d-flex align-items-center justify-content-center min-vh-100"${style}>
                    <button class="btn btn-primary btn-raised btn-lg">${btn}</button>
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
    App.renderDiningChoiceScreen();
  });
  App.bindCarousel(screen.find('#standby-carousel'));
  screen.hide();
  App.jLocaleSwitcher.fadeIn();
  App.jBackButton.fadeOut();
  App.jDiningChoiceIndicator.fadeOut();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn();
};