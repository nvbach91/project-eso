const utils = {
  handleError: (res) => (err) => {
    console.error(err);
    res.status(err.code || 500).json({ msg: err.msg || (err.isOperational ? 'srv_invalid_certificate_password' : 'srv_internal_server_error') });
  },
};

module.exports = utils;