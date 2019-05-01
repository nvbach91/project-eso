const progress = `
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
`;
const slides = [
  {img: 'bg09_hjz6no', btn: 'Let\'s get started' },
  {img: 'bg10_coyfml', btn: 'Let\'s get started' },
  {img: 'bg07_wrsdxe', btn: 'Let\'s get started' },
  {img: 'bg04_i3fq68', btn: 'Let\'s get started' },
  {img: 'bg06_gmmeqj', btn: 'Let\'s get started' },
  {img: 'bg01_mog1lh', btn: 'Let\'s get started' },
  {img: 'bg05_osoyo0', btn: 'Let\'s get started' },
  {img: 'bg02_komziq', btn: 'Let\'s get started' },
  {img: 'bg03_tdlabn', btn: 'Let\'s get started' },
  {img: 'bg08_hsajsa', btn: 'Let\'s get started' },
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
              const style = ` style="background-image: url(${App.config.imageUrlBase}${img})"`;
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
  screen.find('button').click(() => {
    App.renderDiningChoiceScreen();
  });
  App.bindCarousel(screen.find('#standby-carousel'));
  screen.hide();
  App.jMain.replaceWith(screen);
  App.jMain = screen;
  App.jMain.fadeIn();
};