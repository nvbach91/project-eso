const cpTabs = ["Dashboard", "Transactions", "PLU Articles"];

App.renderControlPanelTabs = () => {
  const container = $('<div>');
  Object.keys(cpTabs).forEach((id) => {
    const element = $(`
    <div class="btn btn-primary cp-tab">
      <div class="tab-overlay cp-overlay"></div>
      <div class="cp-tab-name">${cpTabs[id]}</div>
    </div>
    `);
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
      App.activeCPTabPosition = element.index();
      const header = $(`
      <div id="cp-header" class="btn btn-primary btn-raised btn-lg">
        <span>${cpTabs[element.index()]}</span>
      </div>
      `);
      App.jControlPanelHeader.replaceWith(header);
      App.jControlPanelHeader = header;
      App.jControlPanelBody.empty();
      switch(cpTabs[element.index()]) {
        case "Dashboard":
          break;
        case "Transactions":
          App.renderTransactionScreen();
          break;
        case "PLU Articles":
          App.renderProductsScreen();
          break;
      }
    });
    container.append(element);
  });
  container.children()[0].click();

  App.jControlPanelTabs.empty();
  App.jControlPanelTabs.append(container.children());

};

App.renderControlPanelScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="screen control-panel">
        <div id="cp-tabs"></div>
        <div id="cp-tab-screen">
          <div id="cp-header"></div> 
          <div id="cp-body"></div>
        </div>
      </div>
    </main>
  `);
  App.jControlPanelTabs = screen.find('#cp-tabs');
  App.jControlPanelHeader = screen.find("#cp-header");
  App.jControlPanelBody = screen.find('#cp-body');
  App.jMain.replaceWith(screen);
  App.jMain = screen;

  App.renderControlPanelTabs();
};
