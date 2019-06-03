module.exports = {
  handleError: (res) => (err) => {
    console.error(err);
    res.status(err.code || 500).json({ msg: err.msg || 'srv_internal_server_error' });
  }
};