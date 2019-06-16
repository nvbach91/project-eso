

App.renderControlPanelTabs = () => {
  const cpTabs = [
    { icon: 'dashboard', name: 'Dashboard', render: () => {} },
    { icon: 'history', name: 'Transactions', render: App.renderTransactionScreen },
    { icon: 'view_module', name: 'Products', render: App.renderProductsScreen },
  ];
  const container = $('<div>');
  cpTabs.forEach((tab) => {
    const { name, icon, render } = tab;
    console.log(tab);
    const element = $(`
      <button class="btn btn-primary cp-tab">
        <i class="material-icons">${icon}</i>
        <div class="cp-tab-name">${name}</div>
      </button>
    `);
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
      const header = $(`
        <div id="cp-header" class="btn btn-primary btn-raised btn-lg">
          <span>${name}</span>
        </div>
      `);
      App.jControlPanelHeader.replaceWith(header);
      App.jControlPanelHeader = header;
      App.jControlPanelBody.empty();
      render();
    });
    container.append(element);
  });
  container.children().eq(0).click();

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
