App.cpTabs = ["Dashboard", "Transaction History", "PLU Articles"];

App.renderCPTabs = () => {
  const container = $('<div>');
  Object.keys(App.cpTabs).forEach((id) => {
    const element = $(`
    <div class="btn btn-primary cp-tab">
      <div class="tab-overlay cp-overlay"></div>
      <div class="cp-tab-name">${App.cpTabs[id]}</div>
    </div>
    `);
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
      App.activeCPTabPosition = element.index();
      const header = $(`
      <div id="cp-header" class="btn btn-primary btn-raised btn-lg">
        <span>${App.cpTabs[element.index()]}</span>
      </div>
      `);
      App.jCPHeader.replaceWith(header);
      App.jCPHeader = header;
      App.jCPBody.empty();
      switch(App.cpTabs[element.index()]) {
        case "Dashboard":
          break;
        case "Transaction History":
          break;
        case "PLU Articles":
          App.renderPluArticlesScreen();
          break;
      }
    });
    container.append(element);
  });
  container.children()[0].click();

  App.jCPTabs.empty();
  App.jCPTabs.append(container.children());

}