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

};

App.renderControlPanelScreen = () => {
  const screen = $(`
    <main id="main">
      <div class="screen control-panel">
        <div id="cp-tabs"> </div>
        <div id="cp-tab-screen">
          <div id="cp-header"> </div> 
          <div id="cp-body"> </div>
        </div>
      </div>
    </main>
  `);
  App.jCPTabs = screen.find('#cp-tabs');
  //App.jCPTabScreen = screen.find('#cp-tab-screen');
  App.jCPHeader = screen.find("#cp-header");
  App.jCPBody = screen.find('#cp-body');
  App.jMain.replaceWith(screen);
  App.jMain = screen;

  App.renderCPTabs();
};