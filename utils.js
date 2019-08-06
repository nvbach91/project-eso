const utils = {
  handleError: (res) => (err) => {
    console.error(err);
    if (err.code) { res.status(err.code); }
    res.json({ success: false, msg: err.msg || (err.isOperational ? 'srv_invalid_certificate_password' : err) || err });
  },
};

module.exports = utils;