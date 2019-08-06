const utils = {
  handleError: (res) => (err) => {
    console.error(err);
    if (err.code) { res.status(err.code); }
    res.json({ msg: err.msg || (err.isOperational ? 'srv_invalid_certificate_password' : 'srv_internal_server_error') || err });
  },
};

module.exports = utils;