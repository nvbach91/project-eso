App.renderLoginForm = () => {
  const loginScreen = $(`
    <div class="container-signin text-center">
      <div class="signin-aside"></div>
      <form class="card form-signin">
        <button type="button" id="launch" class="btn btn-primary btn-lg mb-4">${App.getIcon('fingerprint', 48)}</button>
        <h1 class="h3 mb-3 font-weight-normal">Launch</h1>
        <h2 class="h4 mb-3 font-weight-bold">${$('title').text().replace('|', '<br>')}</h2>
        <div class="input-group">
          <span class="input-group-addon">${App.getIcon('public')}</span>
          <input name="subdomain" class="form-control" placeholder="Subdomain" disabled>
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
        <p class="mt-5 mb-3 text-muted">${App.credits}<br>${App.provider}</p>
      </form>
    <div>
  `);
  const loginForm = loginScreen.find('.form-signin');
  loginForm.find('#launch').click(() => {
    loginForm.toggleClass('full-width');
  });
  const subdomainInput = loginForm.find('[name="subdomain"]').val(`${location.protocol}//${location.hostname}`);
  const usernameInput = loginForm.find('[name="username"]');
  const passwordInput = loginForm.find('[name="password"]');
  loginForm.submit((e) => {
    e.preventDefault();
    if (App.autologinTimeout) {
      clearTimeout(App.autologinTimeout);
    }
    App.authenticate({
      subdomain: subdomainInput.val().replace(/http(s)?:\/\//, '').split('.')[0],
      username: usernameInput.val(),
      password: passwordInput.val(),
    }).done((resp) => {
      localStorage.setItem('jwt', resp.token);
      App.pasuwado = window.btoa(passwordInput.val());
      App.user = resp.user;
      loginScreen.remove();
      App.start();
    }).fail((err) => {
      App.showInModal('Access denied', 'Warning');
    });
  });
  App.jContainer.append(loginScreen);
  try {
    const autoLogin = JSON.parse(localStorage.getItem('autoLogin') || '{}');
    if (autoLogin.username && autoLogin.password) {
      App.autologinTimeout = setTimeout(() => {
        if (!document.contains(loginForm[0])) {
          return false;
        }
        loginForm.find('input[name="username"]').val(autoLogin.username);
        loginForm.find('input[name="password"]').val(window.atob(autoLogin.password));
        loginForm.submit();
      }, 2000);
    }
  } catch (e) {
    localStorage.removeItem('autoLogin');
  }
};

App.authenticate = ({ subdomain, username, password }) => {
  return $.post('/auth', { username: `${subdomain}:${username}`, password });
};