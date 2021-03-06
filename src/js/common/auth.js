App.renderLoginForm = () => {
  const dom = $(`
    <div class="container-signin text-center">
      <div class="signin-aside"></div>
      <form class="card form-signin">
        <button type="button" id="launch" class="btn btn-primary btn-lg mb-4">${App.getIcon('fingerprint', 48)}</button>
        <h1 class="h3 mb-3 font-weight-normal">Launch</h1>
        <h2 class="h4 mb-3 font-weight-bold">${$('title').text().replace('|', '<br>')}</h2>
        <div class="input-group">
          <span class="input-group-addon">${App.getIcon('public')}</span>
          <input name="subdomain" class="form-control" placeholder="Subdomain">
        </div>
        <div class="input-group">
          <span class="input-group-addon">${App.getIcon('person')}</span>
          <input name="username" class="form-control" placeholder="Username / Email address" required autofocus>
        </div>
        <div class="input-group">
          <span class="input-group-addon">${App.getIcon('lock')}</span>
          <input type="password" name="password" class="form-control" placeholder="Password" required>
        </div>
        <br>
        <button class="btn btn-raised btn-primary btn-lg btn-block">Sign in</button>
        <p class="mt-5 mb-3 text-muted">${App.credits}</p>
      </form>
    <div>
  `);
  const loginForm = dom.find('.form-signin');
  loginForm.find('#launch').click(() => {
    loginForm.toggleClass('full-width');
  });
  const subdomainInput = loginForm.find('[name="subdomain"]').val(location.protocol + '//' + location.hostname);
  const usernameInput = loginForm.find('[name="username"]');//.val('demo@gmail.com');
  const passwordInput = loginForm.find('[name="password"]');//.val('demo@gmail.com');
  loginForm.submit((e) => {
    e.preventDefault();
    App.authenticate({
      subdomain: subdomainInput.val().replace(/http(s)?:\/\//, '').split('.')[0],
      username: usernameInput.val(),
      password: passwordInput.val(),
    }).done((resp) => {
      localStorage.setItem('jwt', resp.token);
      App.user = resp.user;
      dom.remove();
      App.start();
    }).fail((err) => {
      App.showInModal('Access denied', 'Warning');
    });
  });
  App.jContainer.append(dom);
};

App.authenticate = ({ subdomain, username, password }) => {
  return $.post('/auth', { username: `${subdomain}:${username}`, password });
};