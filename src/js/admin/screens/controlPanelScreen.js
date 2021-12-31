App.renderControlPanelTabs = () => {
  const cpTabs = [
    { icon: 'dashboard', name: App.lang.admin_dashboard, render: App.renderDashboardScreen },
    { icon: 'history', name: App.lang.admin_transactions, render: App.renderTransactionScreen },
    { icon: 'view_module', name: App.lang.admin_products, render: App.renderProductsScreen },
    { icon: 'style', name: App.lang.admin_modifications, render: App.renderModsScreen },
    { icon: 'category', name: App.lang.admin_groups, render: App.renderGroupsScreen },
    { icon: 'business', name: App.lang.admin_company, render: App.renderCompanyScreen },
    { icon: 'web_asset', name: App.lang.admin_kiosk, render: App.renderKioskScreen },
    { icon: 'device_hub', name: App.lang.admin_peripherals, render: App.renderPeripheralsScreen },
  ];
  const container = $('<div>');
  cpTabs.forEach((tab) => {
    const { name, icon, render } = tab;
    const element = $(`
      <button class="btn btn-primary cp-tab">
        ${App.getIcon(icon)}
        <div class="cp-tab-name">${name}</div>
      </button>
    `);
    element.click(() => {
      element.addClass('active').blur();
      element.siblings().removeClass('active');
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
        <div id="cp-tab-screen" class="card no-bounds-card">
          <div id="cp-header" class="card-header"></div> 
          <div id="cp-body" class="card-body"></div>
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
