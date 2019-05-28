App.renderLoginForm = () => {
  const loginForm = $(`
    <div class="container-signin text-center">
      <div class="signin-aside"></div>
      <form class="card form-signin">
        <button type="button" class="btn btn-primary btn-lg mb-4"><i class="material-icons" style="font-size: 48px">fingerprint</i></button>
        <h1 class="h3 mb-3 font-weight-normal">Launch</h1>
        <h2 class="h4 mb-3 font-weight-bold">Itadakimasu Restaurant</h2>
        <label for="subdomain" class="sr-only">Subdomain</label>
        <input name="subdomain" class="form-control" placeholder="Subdomain">
        <label for="username" class="sr-only">Username</label>
        <input type="email" name="username" class="form-control" placeholder="Username / Email address" required autofocus>
        <label for="password" class="sr-only">Password</label>
        <input type="password" name="password" class="form-control" placeholder="Password" required>
        <br>
        <button class="btn btn-raised btn-primary btn-lg btn-block">Sign in</button>
        <p class="mt-5 mb-3 text-muted">${App.credits}</p>
      </form>
    <div>
  `);
  App.jContainer.append(loginForm);
  const subdomain = loginForm.find('[name="subdomain"]').val(location.hostname);
  const username = loginForm.find('[name="username"]').val('demo@gmail.com');
  const password = loginForm.find('[name="password"]').val('demo@gmail.com');
  loginForm.submit((e) => {
    e.preventDefault();
    App.authenticate({
      subdomain: subdomain.val(),
      username: username.val(),
      password: password.val(),
    }).done((resp) => {
      loginForm.remove();
      App.start();
    }).fail((err) => {
      App.showInModal('Access denied');
    });
  });
};

App.authenticate = ({ username, password }) => {
  return $.post('/api/v1/auth', { username, password });
};