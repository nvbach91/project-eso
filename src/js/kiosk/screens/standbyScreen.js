const progress = `
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
`;
App.renderStandbyScreen = () => {
  const slideIds = Object.keys(App.settings.slides);
  slideIds.sort((a, b) => App.settings.slides[a].order - App.settings.slides[b].order);
  const screen = $(`
    <main id="main">
      <div class="container-fluid px-0">
        <div id="standby-carousel" class="carousel slide" data-ride="carousel">
          <ol class="carousel-indicators">
            ${slideIds.map((slideId, index) => {
              return `<li data-target="#standby-carousel" data-slide-to="${index}" ${index === App.currentSlidePosition ? ' class="active"' : ''}></li>`
            }).join('')}
          </ol>
          <div class="carousel-inner bg-info" role="listbox">
            ${slideIds.map((slideId, index) => {
              const { img, text, video } = App.settings.slides[slideId];
              return `
                <div class="carousel-item${index === App.currentSlidePosition ? ' active' : ''}">
                  ${video ? `
                    <video autoplay muted loop src="${video}"></video>
                  ` : `
                    <div class="d-flex align-items-center justify-content-center min-vh-100"${App.getBackgroundImage(img)}>
                      ${text ? `<button class="btn btn-primary btn-raised btn-lg btn-xlg">${text}</button>` : ''}
                    </div>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </main>
  `);
  screen.find('.carousel-item').click(() => {
    if (Offline.state === 'down') {
      return App.showWarning(App.lang.misc_device_is_offline);
    }
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