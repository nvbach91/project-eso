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